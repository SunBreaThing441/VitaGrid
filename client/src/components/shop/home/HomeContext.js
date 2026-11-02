export const homeState = {
  categoryListDropdown: false,
  filterListDropdown: false,
  searchDropdown: false,
  products: null,
  loading: false,
  sliderImages: [],
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterListDropdown: false,
        searchDropdown: false,
      };
    case "filterListDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: action.payload,
        searchDropdown: false,
      };
    case "searchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
    case "searchHandleInReducer":
      const query = (action.payload || "").trim().toUpperCase();
      return {
        ...state,
        products:
          action.productArray &&
          action.productArray.filter((item) => {
            if (!query) return true;
            const nameMatch = String(item.pName || "").toUpperCase().indexOf(query) !== -1;
            const descMatch = String(item.pDescription || "").toUpperCase().indexOf(query) !== -1;
            const catMatch = String(item.pCategory?.cName || "").toUpperCase().indexOf(query) !== -1;
            const pinMatch = String(item.pPrice || "").toUpperCase().indexOf(query) !== -1;
            return nameMatch || descMatch || catMatch || pinMatch;
          }),
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
    default:
      return state;
  }
};
