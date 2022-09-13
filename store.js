/**
 * @Asyncstorage data structure
 * user_id
 * token
 * 
 * */


const Store = {
    searchString: '',
    searchFlag: false,
    token: '',
    user_id: '',
    userID: 1,
    firstName: '',
    lastName: '',
    fileCount: 0, // total data number from server
    fileData: [], // file data from server
    detailData: [], // file in info for detail page
    indexPage: 0, // page number for pagination
    perPage: 10, // pagination number
    fileName: '', // search filename
    locale: "en-US"
}

export default Store;