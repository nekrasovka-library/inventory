import token from "./token";
import store from "./store";

export default {
  logout: (kc, state) => {
    token.clear();
    state({
      initialized: false,
      roles: [],
      name: "",
      user: "",
      department: "",
      tokenParsed: {},
    });
    kc.logout();
  },
  login: (kc, state, history) => {
    let location = store.location.get();
    location = location || "/";

    kc.init(store.keycloak.onAuth).then((authenticated) => {
      let department = !!kc.idTokenParsed.groups
        ? kc.idTokenParsed.groups.filter(function (f) {
            return f.includes("Подразделения");
          })
        : [];

      department = !!department.length
        ? department[0].split("/")[2]
        : department;

      if (authenticated) {
        state({
          initialized: !!kc && authenticated,
          roles: kc.realmAccess.roles,
          name: kc.idTokenParsed.name,
          user: kc.idTokenParsed.email,
          tokenParsed: kc.idTokenParsed,
          department,
        });
        token.set(kc.token);
        history.replace(location);
      } else kc.login();
    });
  },
};
