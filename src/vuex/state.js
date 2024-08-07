let readerMode = 'row-reader-component';
let currentTitle = '';
let currentTotal = 1;
let currentPage = 1;
let loadingDetail = null;
let slot = 'default';
let slotList = ['default'];
let url = ''
let cb_id = ''
let book_type = ''
let base_url = ''
let shelfList = []
try{
    if(localStorage.slot)slot = localStorage.slot;
    if(localStorage.slotList)slotList = JSON.parse(localStorage.slotList);
    if(localStorage['readerMode'+slot] === undefined) slot='default';  //slot信息不存在，使用默認slot。
    if(localStorage['readerMode'+slot])readerMode = localStorage['readerMode'+slot];
    if(localStorage['currentTitle'+slot])currentTitle = localStorage['currentTitle'+slot];
    if(localStorage['currentTotal'+slot])currentTotal = parseInt(localStorage['currentTotal'+slot]);
    if(localStorage['currentPage'+slot])currentPage = parseInt(localStorage['currentPage'+slot]);
}catch (e) {
    //
}

export default {
    slot,
    slotList,
    currentFile: {},
    currentTitle,
    currentTotal,
    currentPage,
    loadingDetail,
    readerMode,
    url,
    cb_id,
    book_type,
    base_url,
    shelfList,
};
