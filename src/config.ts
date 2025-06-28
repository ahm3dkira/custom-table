// src/config.ts

// const { GETFetcher, getFetcherURL } = getConfig();

export const TEST_MODE_NO_AUTH = false;
// const TEST_MODE_NO_AUTH = import.meta.env.VITE_TEST_MODE_NO_AUTH === 'true' || false;

// For Create React App, use:
// const TEST_MODE_NO_AUTH = (window as any).REACT_APP_TEST_MODE_NO_AUTH === 'true' || false;
export const MAX_CELL_LENGTH = 40;


export const Logout = () => {
  // TODO: implement logout
//   localStorage.removeItem('token');
};
// export const download = MyUtils.api.download;
// export function download(data, filename) {
//   // var file = new Blob([data], { type: type });
//   var file = new Blob([data]);
//   if (window.navigator.msSaveOrOpenBlob)
//     // IE10+
//     window.navigator.msSaveOrOpenBlob(file, filename);
//   else {
//     // Others
//     var a = document.createElement('a'),
//       url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function () {
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//       // console.log('done');
//     }, 0);
//   }
// }
type FetcherProps = {
    url: string;
    ContentType?: string;
    data?: any;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: any;
};
async function defaultFetcher({ url, data, method, params, ContentType = 'application/json'  }: FetcherProps) {
	const API_HOST = window.location.protocol + '//' + window.location.host + '/api';
  let fetchURL = API_HOST + url;
  if (params) {
    const urlParams = new URLSearchParams(params).toString();
    // console.log(urlParams);
    fetchURL = fetchURL + '?' + urlParams;
  }

  if (url==='/blog' && method === 'POST') {
    ContentType = 'multipart/form-data';
  }
  let temp: any = {
  }
  // ------------------------------
  if (ContentType === 'application/json') {
    data = JSON.stringify(data);
    temp = {
      'Content-Type': ContentType,
    }
  }
  if(url!=="/auth/login"){
    temp.Authorization = `Bearer ${localStorage.getItem('token') || ''}`;
  }
  if (ContentType === 'multipart/form-data') {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    data = formData;
  }
  if(url==="/blog/updatecoverimageurl"){
    data.delete("imageUrl")
  }
  const response = await fetch(fetchURL, {
    method: method || 'GET',
    headers: {
      ...temp
    },
    body: data
    // body: data ?ContentType==='multipart/form-data'?data: JSON.stringify(data) : null
  });
  const responseData = await response.json();

  if (response.status === 401) Logout();

  if (!response.ok) {
    throw responseData;
  }
  return responseData;
}

// export function getFetcherURL() {
//   return API_HOST 
// }
// export const getGetListURL = (model: string) => {
//   return `/${model}`;
//   // return `/${model}/get${model.charAt(0).toUpperCase() + model.slice(1)}List`;
// };

////////////////////////////////////////////////////////////////////



export const defaultConfig = {
	fetcher: defaultFetcher,
	getGetListURL: (model: string) => `/${model}`,

  // ------------------------------------ 
  PAGINATION_TYPE: "type2",
//   MAX_LENGTH: 50,
//   MIN_LENGTH: 3,
//   DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',

};

let userConfig = { ...defaultConfig };

export function setConfig(overrides: Partial<typeof defaultConfig>) {
  userConfig = { ...userConfig, ...overrides };
}

export function setFetcher(fetcher: typeof defaultFetcher) {
  userConfig.fetcher = fetcher;
}

export function getConfig() {
  return userConfig;
}

export function getFetcher() {
  return userConfig.fetcher;
}