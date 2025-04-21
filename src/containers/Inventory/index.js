import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Section from "../../nekrasovka-ui/Section";
import * as XLSX from "xlsx";
import format from "date-fns/format";
import locale from "date-fns/locale/ru";
import { connect } from "react-redux";
import {
  clearProgress,
  closeProgress,
  finishProgress,
  startProgress,
} from "../../reducers/progress/actions";
import { AlertContext } from "../../nekrasovka-ui/Alert/AlertProvider";
import axios from "axios";
import Verification from "./components/Verification";
import Archive from "./components/Archive";
import Form from "./components/Form";
import Scanner from "./components/Scanner";
import Navigation from "./components/Navigation";
import Table from "./components/Table";
import Stats from "./components/Stats";
import ModalCloseInventory from "./components/ModalCloseInventory";

const BASE_URL = "http://127.0.0.1:21646/rfid";
const DEVICES_URL = `${BASE_URL}?action=getDevicesList`;
const BOOK_API_URL = "https://cataloguisation.api.nekrasovka.ru/api/book/";
const CATALOGUING_API_URL =
  "https://cataloguisation.api.nekrasovka.ru/api/cataloguing";

const statuses = {
  0: "UNKNOWN",
  1: "LOADING",
  2: "PENDING",
  3: "IN_PROGRESS",
  4: "FOUND",
  5: "NOT_FOUND",
  6: "FAILED_TO_LOAD",
};

// UNKNOWN: зарезервирован,
// LOADING: с момента создания до момента заполнения из OPAC
// PENDING: ожидает работы
// IN_PROGRESS: промежуточный, для указания о том, что книга в обработке (не используется)
// FOUND: когда найдена, устанавливает $v с текущей датой в OPAC
// NOT_FOUND: в теории, этот должен быть установлен всем книгам, которые точно описываются как пропавшие (не используется)
// FAILED_TO_LOAD: устанавливается после 1, но когда в OPAC книга не находится

async function fetchCataloguingData(inventoryId, term, getRequest) {
  const url = `${CATALOGUING_API_URL}/${inventoryId}/books?term=${term}`;
  const response = await getRequest(url);
  return response.data.data;
}

function addBookToList(updatedBooks, bookData) {
  updatedBooks.unshift(bookData);
}

const Inventory = ({
  checkTokenExpiredYesUpdate,
  startProgress,
  finishProgress,
  closeProgress,
  clearProgress,
}) => {
  const initStatistics = {};
  const initInventory = {
    id: null,
    name: "",
    exclude: "",
    range: {},
    date: "",
    comment: "",
    loaded: false,
    owner: "",
    dbid: "",
  };
  const initInventoryBase = [];
  const initRfid = {
    data: [],
    error: false,
    loaded: false,
  };

  const today = new Date();
  const formatedToday = format(today, "dd-MM-yyyy", { locale });
  const commentRef = useRef();
  const rangeRef = useRef();

  const [barcode, setBarcode] = useState("");
  const [books, setBooks] = useState([]);
  const [verification, setVerification] = useState({
    data: [],
    loaded: false,
    total: 0,
    limit: 10,
  });
  const [archive, setArchive] = useState({
    data: [],
    loaded: false,
  });
  const [statistics, setStatistics] = useState(initStatistics);
  const [rfid, setRfid] = useState(initRfid);
  const [inventory, setInventory] = useState(initInventory);
  const [inventoryBase, setInventoryBase] = useState(initInventoryBase);
  const [isRfidOpen, setIsRfidOpen] = useState(false);
  const [isManual, setIsManual] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [type, setType] = useState(0);
  const [selectedRFID, setSelectedRFID] = useState("");
  const [selectedArchive, setSelectedArchive] = useState({ loaded: false });
  const [selectedArchiveId, setSelectedArchiveId] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dispatch } = useContext(AlertContext);

  const getAccessToken = async () => {
    const { refreshed, TOKEN_KEY } = await checkTokenExpiredYesUpdate();
    if (refreshed) {
      localStorage.setItem("TOKEN_KEY", TOKEN_KEY);
      return TOKEN_KEY;
    }
    return localStorage.getItem("TOKEN_KEY");
  };

  const getRequest = async (url, method = "get", data) => {
    const API_TEAM_KEY = process.env.REACT_APP_TEAM_KEY;
    const token = await getAccessToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Api-Key": API_TEAM_KEY,
    };

    const options = { method, url, headers, data };

    try {
      const response = await axios(options);
      console.log("❗getRequest response", response);
      return response;
    } catch (error) {
      console.error("❗getRequest error", error);
      dispatch({
        type: "ALERT_ON",
        name: "error",
        error,
      });
    }
  };

  const parseDevicesData = async (response) => {
    try {
      console.log("Attempting to parse response as JSON...");
      const data = await response.json();

      if (data.length > 0) {
        console.log("Devices found:", data);
        return { data, loaded: true, error: false };
      } else {
        console.log("No devices found");
        return { data: [], loaded: false, error: true };
      }
    } catch (err) {
      console.error("Error parsing response as JSON:", err);
      return { data: [], loaded: false, error: true };
    }
  };

  const getDevices = async () => {
    console.log("getDevices function called");

    try {
      console.log("Attempting to fetch devices from:", DEVICES_URL);
      const response = await fetch(DEVICES_URL);

      const result = await parseDevicesData(response);
      setRfid(result);
      return { loaded: result.loaded };
    } catch (err) {
      console.error("Error fetching devices:", err);
      setRfid({ data: [], loaded: false, error: true });
      return { loaded: false };
    }
  };

  const getItems = async () => {
    console.log("getItems function called with deviceId:", selectedRFID);
    const items = await fetchItems(selectedRFID);

    if (items.length > 0) {
      await processItemsData(items);
      setIsPaused(false);
    } else {
      console.log("No items found");
    }
  };

  const fetchItems = async (deviceId) => {
    try {
      const url = `${BASE_URL}?action=getItemsList&deviceId=${deviceId}`;
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const foundBook = (array, id) => {
    let book = {};
    let isBook = false;

    if (array.length > 0) {
      const filteredArray = array.filter((f) =>
        Object.values(f).some((value) => value && value.toString() === id),
      );

      if (filteredArray.length > 0) {
        book = filteredArray[0];
        isBook = true;
      }
    }

    return { book, isBook };
  };

  const processItemsData = async (items) => {
    console.log("Items found:", items);
    const updatedBooks = [...books];

    setIsPaused(true);

    for (let item of items) {
      const { isBook } = foundBook(updatedBooks, item.id);

      if (!isBook) {
        const r1Data = await fetchCataloguingData(
          inventory.id,
          item.id,
          getRequest,
        );
        const hasBookData = r1Data.length > 0;

        if (hasBookData) {
          const isBookStatusFailedToLoad = r1Data[0].status === 6;

          if (isBookStatusFailedToLoad) {
            addBookToList(updatedBooks, r1Data[0]);
          } else {
            const url = `${BOOK_API_URL}search?term=${item.id}&page=1`;
            const response = await getRequest(url);
            const data = response.data.data[0];

            if (data.status !== 4) {
              data.prevStatus = data.status;
              data.status = 4;
            }

            addBookToList(updatedBooks, {
              ...data,
              name: `${data.title}, ${data.author}`,
            });
          }
        } else {
          addBookToList(updatedBooks, {
            search_term: item.id,
            status: null,
          });
        }
      }
    }

    setBooks(updatedBooks);
  };

  const handleGetBarcode = async () => {
    const { book, isBook } = foundBook(books, barcode);
    const updatedBooks = [...books];

    if (isBook) {
      const explanation = book.title
        ? `«${book.title}»`
        : `с меткой ${book.search_term}`;
      const text = `Книга ${explanation} уже добавлена в список для проверки.`;

      dispatch({
        type: "ALERT_ON",
        name: "error",
        text,
      });
    } else {
      const r1Data = await fetchCataloguingData(
        inventory.id,
        barcode,
        getRequest,
      );
      const hasBookData = r1Data.length > 0;

      if (hasBookData) {
        const isBookStatusFailedToLoad = r1Data[0].status === 6;

        if (isBookStatusFailedToLoad) {
          const text = `Книга с меткой ${barcode} не найдена в ОПАК`;
          dispatch({
            type: "ALERT_ON",
            name: "error",
            text,
          });

          addBookToList(updatedBooks, r1Data[0]);
        } else {
          const url = `${BOOK_API_URL}search?term=${barcode}&page=1`;
          const response = await getRequest(url);
          const data = response.data.data[0];

          if (data.status !== 4) {
            data.prevStatus = data.status;
            data.status = 4;
          }

          addBookToList(updatedBooks, {
            ...data,
            name: `${data.title}, ${data.author}`,
          });
        }

        setBarcode("");
        setBooks(updatedBooks);
      } else {
        const text = `Книга с меткой ${barcode} отсутствует в выборке инвентарных номеров для инвентаризации. Добавить в таблицу с отметкой "Отсутствует в выборке инвентарных номеров"?`;
        const isConfirm = confirm(text);

        if (isConfirm) {
          addBookToList(updatedBooks, {
            search_term: barcode,
            status: null,
          });

          setBarcode("");
          setBooks(updatedBooks);
        }
      }
    }
  };

  const handleBook = async (id, statusNumber) => {
    const url = `${BOOK_API_URL}${id}/status`;
    const method = "patch";
    const status = statuses[statusNumber];

    await getRequest(url, method, { status });
    await getStatistics(inventory.id);
  };

  const handleRFID = (item) => {
    const text =
      'Положите книгу на RFID-коврик, дождитесь загрузки данных и сравните правильность соответствия. Если все верно – нажмите кнопку "Отметить наличие".';

    setSelectedRFID(item === selectedRFID ? "" : item);
    setIsRfidOpen(false);

    dispatch({
      type: "ALERT_ON",
      name: "success",
      text,
    });
  };

  const handleInventory = async () => {
    const url = `${CATALOGUING_API_URL}/new`;
    const method = "post";

    const formData = new FormData();
    formData.append("csvList", inventory.range.fileData);
    formData.append("title", inventory.name);
    formData.append("dbid", inventory.dbid);

    await getRequest(url, method, formData);
    await getInventory();
  };

  const transformObjectToArray = (obj) => {
    return Object.entries(obj).map(([key, label]) => ({
      key,
      label,
    }));
  };

  const getInventoryBase = async () => {
    const url = `https://cataloguisation.api.nekrasovka.ru/api/system/databases`;

    const response = await getRequest(url);
    setInventoryBase(transformObjectToArray(response.data.data));
  };

  const getInventory = async () => {
    const url = `${CATALOGUING_API_URL}/list`;
    clearProgress();
    startProgress();

    const response = await getRequest(url);
    const temp = response.data.data
      .filter((item) => item.status === 1)
      .map((item) => {
        return {
          id: item.id,
          name: item.title,
          owner: item.owner_email,
          date: {
            created_at: format(new Date(item.created_at), "dd-MM-yyyy", {
              locale,
            }),
          },
        };
      });

    if (!!temp.length) {
      await getStatistics(temp[0].id);

      setInventory({
        id: temp[0].id,
        name: temp[0].name,
        owner: temp[0].owner,
        date: temp[0].date.created_at,
        exclude: "",
        range: {},
        comment: "",
        loaded: true,
      });

      setType(1);
    }

    setIsInitial(false);

    finishProgress();
    setTimeout(() => closeProgress(), 300);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const patchCloseInventory = async (params = "") => {
    const url = `${CATALOGUING_API_URL}/${inventory.id}/status`;
    const method = "patch";
    const data = { status: "FINISHED", ...params };

    await getRequest(url, method, data);

    if (type === 3) await getArchive();
    else setType(3);

    setSelectedArchiveId(inventory.id);
    setBooks([]);
    setInventory(initInventory);
  };

  const closeInventory = async () => {
    if (statistics.pending > 0) handleOpenModal();
    else await patchCloseInventory();
  };

  const exportPENDING = async ({ id = inventory.id }) => {
    const promptValue = "Введите имя файла без расширения (необязательно)";
    const head = ["Идентификатор", "Описание из АБИС", "Инвентарный номер"];

    const url = `${CATALOGUING_API_URL}/${id}/books?status=PENDING&limit=100000`;

    closeProgress();
    startProgress();

    const response = await getRequest(url);

    const json = response.data.data.map((item, i) => {
      return {
        "№": i + 1,
        [head[0]]: item.identificator,
        [head[1]]: `${item.title}, ${item.author}`,
        [head[2]]: `${item.search_term}`,
      };
    });

    const fileName = prompt(promptValue, "") || "SheetJSExportAOO";

    const ws = XLSX.utils.json_to_sheet(json);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${fileName}.xlsx`, { compression: true });

    setTimeout(() => {
      finishProgress();
      closeProgress();
    }, 300);
  };

  const exportINITIAL = async ({ id = inventory.id }) => {
    const promptValue = "Введите имя файла без расширения (необязательно)";
    const head = ["Инвентарный номер"];

    const url = `${CATALOGUING_API_URL}/${id}/source`;

    closeProgress();
    startProgress();

    const response = await getRequest(url);
    const a = response.data.split("\r\n");
    const b = a.filter((key) => key !== "");

    const json = b.map((item, i) => {
      return {
        "№": `${i + 1}`,
        [head[0]]: item,
      };
    });

    const fileName = prompt(promptValue, "") || "SheetJSExportAOO";

    const ws = XLSX.utils.json_to_sheet(json);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const max_width_A = json.reduce((w, r) => Math.max(w, r["№"].length), 1);
    const max_width_B = json.reduce(
      (w, r) => Math.max(w, r[head[0]].length),
      1,
    );
    ws["!cols"] = [{ wch: max_width_A }, { wch: max_width_B }];

    XLSX.writeFile(wb, `${fileName}.xlsx`, { compression: true });

    setTimeout(() => {
      finishProgress();
      closeProgress();
    }, 300);
  };

  const handleManual = () => {
    setIsManual(!isManual);

    if (isRfidOpen) setIsRfidOpen(false);
  };

  const handleCheckBooks = async () => {
    for (let book of books) {
      if (!!book.prevStatus) {
        await handleBook(book.id, book.status);
      }
    }

    setBooks([]);
  };

  const handleTypeBarcode = ({ target }) => {
    const value = target.value;

    const pattern1 = /^209.*/;
    const isPattern1 = pattern1.test(value);
    const isMoreThan13 = value.length > 13;

    if (isPattern1) {
      dispatch({
        type: "ALERT_ON",
        text: `Нельзя, чтобы введенное значение начиналось с 209`,
        name: "warning",
      });
    } else if (isMoreThan13) {
      dispatch({
        type: "ALERT_ON",
        text: `Не больше 13 символов`,
        name: "warning",
      });
    } else setBarcode(value);
  };

  const handleRange = () => {
    rangeRef.current.click();
  };

  const handleFile = async (event) => {
    const fileData = event.target.files[0];
    const fileName = fileData.name;

    setInventory({
      ...inventory,
      range: { fileName, fileData },
    });
  };

  const textareaAdjust = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const getStatistics = async (id) => {
    const url = `${CATALOGUING_API_URL}/${id}/stats`;

    const response = await getRequest(url);

    setStatistics(response.data.data);
  };

  const handleArchive = async (id) => {
    clearProgress();
    startProgress();

    const url = `${CATALOGUING_API_URL}/${id}/stats`;
    const response = await getRequest(url);

    const owner = archive.data.find((item) => item.id === id).owner;
    setSelectedArchive({
      ...response.data.data,
      id,
      owner,
      difference: !!response.data.data.pending
        ? response.data.data.total - response.data.data.pending
        : 0,
      loaded: true,
    });

    finishProgress();
    setTimeout(() => closeProgress(), 300);
  };

  const getArchive = async () => {
    const url = `${CATALOGUING_API_URL}/list`;

    clearProgress();
    startProgress();

    const response = await getRequest(url);

    const temp = response.data.data
      .filter((item) => item.status !== 1)
      .map((item) => {
        return {
          id: item.id,
          name: item.title,
          owner: item.owner_email,
          date: {
            created_at: format(new Date(item.created_at), "dd-MM-yyyy", {
              locale,
            }),
            updated_at:
              item.updated_at === item.created_at
                ? ""
                : format(new Date(item.updated_at), "dd-MM-yyyy", {
                    locale,
                  }),
          },
        };
      });

    setArchive({ data: temp, loaded: true });
    finishProgress();
    setTimeout(() => closeProgress(), 300);
  };

  const handleVerification = async (
    url = `${CATALOGUING_API_URL}/${inventory.id}/books?status=PENDING&limit=${verification.limit}`,
  ) => {
    clearProgress();
    startProgress();

    const {
      data: { data, pages },
    } = await getRequest(url);

    setVerification({
      ...verification,
      data,
      loaded: true,
      total: pages.total,
    });

    finishProgress();
    setTimeout(() => closeProgress(), 300);
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    if (commentRef.current) textareaAdjust(commentRef.current);
  }, [commentRef.current, inventory.comment]);

  let devicePollingIntervalId = null;
  const pollDevices = async () => {
    const deviceData = await getDevices();
    if (deviceData.loaded) clearInterval(devicePollingIntervalId);
  };

  useEffect(() => {
    if (isManual || rfid.loaded) {
      clearInterval(devicePollingIntervalId);
    } else {
      devicePollingIntervalId = setInterval(pollDevices, 300);
    }

    return () => clearInterval(devicePollingIntervalId);
  }, [isManual]);

  useEffect(() => {
    let intervalId = null;

    const shouldStartInterval = !!selectedRFID && !isManual && !isPaused;
    if (shouldStartInterval) {
      intervalId = setInterval(getItems, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [selectedRFID, isManual, isPaused]);

  return (
    <Container>
      <Navigation
        closeInventory={closeInventory}
        inventory={inventory}
        type={type}
        setType={setType}
        getStatistics={getStatistics}
      />
      {isInitial ? (
        "Поиск открытых инвентаризаций..."
      ) : (
        <>
          {inventory.loaded ? (
            <>
              <Title>{inventory.name}</Title>
              <Stats
                type={type}
                inventory={inventory}
                statistics={statistics}
                exportPENDING={exportPENDING}
                exportINITIAL={exportINITIAL}
              />
              {type === 1 && (
                <Scanner
                  handleGetBarcode={handleGetBarcode}
                  handleManual={handleManual}
                  handleRFID={handleRFID}
                  handleTypeBarcode={handleTypeBarcode}
                  isManual={isManual}
                  isRfidOpen={isRfidOpen}
                  rfid={rfid}
                  selectedRFID={selectedRFID}
                  setIsRfidOpen={setIsRfidOpen}
                  barcode={barcode}
                  setIsManual={setIsManual}
                  isModalOpen={isModalOpen}
                />
              )}
              {type === 1 && (
                <Table
                  books={books}
                  handleCheckBooks={handleCheckBooks}
                  setBooks={setBooks}
                />
              )}
              {type === 2 && (
                <Verification
                  handleVerification={handleVerification}
                  setVerification={setVerification}
                  verification={verification}
                  inventoryId={inventory.id}
                />
              )}
            </>
          ) : (
            type === 0 && (
              <Form
                formatedToday={formatedToday}
                inventory={inventory}
                setInventory={setInventory}
                commentRef={commentRef}
                handleInventory={handleInventory}
                handleRange={handleRange}
                rangeRef={rangeRef}
                handleFile={handleFile}
                getInventoryBase={getInventoryBase}
                inventoryBase={inventoryBase}
              />
            )
          )}
          {type === 3 && (
            <Archive
              getArchive={getArchive}
              handleArchive={handleArchive}
              setSelectedArchive={setSelectedArchive}
              setArchive={setArchive}
              archive={archive}
              setSelectedArchiveId={setSelectedArchiveId}
              selectedArchiveId={selectedArchiveId}
              selectedArchive={selectedArchive}
              exportINITIAL={exportINITIAL}
              exportPENDING={exportPENDING}
            />
          )}
          {isModalOpen && (
            <ModalCloseInventory
              handleCloseModal={handleCloseModal}
              patchCloseInventory={patchCloseInventory}
            />
          )}
        </>
      )}
    </Container>
  );
};

const mapStateToProps = ({ allowance: { checkTokenExpiredYesUpdate } }) => ({
  checkTokenExpiredYesUpdate,
});

export default connect(mapStateToProps, {
  startProgress,
  finishProgress,
  closeProgress,
  clearProgress,
})(Inventory);

const Container = styled(Section)`
  display: flex;
  flex-direction: column;
  row-gap: 30px;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  button {
    align-items: center;
    border-radius: 5px;
    height: 33px;

    :disabled {
      opacity: 0.5;
    }
  }

  @media (min-width: 769px) {
    padding-top: 15px;
  }

  @media (max-width: 768px) {
    padding: 15px 0;
  }
`;

const Title = styled.div`
  font-size: 18px;
`;
