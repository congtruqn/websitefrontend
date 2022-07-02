module.exports.filterDetailByLang = function(data,lang,change_url){
    data = data.filter(function(content) {
        return content.detail.find(obj => obj.lang == lang)
    });
    return data.map(function(item){
        let details = item.detail.find(obj => obj.lang == lang)
        item.details = details
        if(change_url===1){
            item.url = lang+'/'+item.seo_url
        }
        return item
    })
}