(function(){function t(t,e){var r=document.getElementById("search-results");if(t.length){var o="";for(var n=0;n<t.length;n++){var i=e[t[n].ref];o+='<li class="mb3 block">'+i.category+'<br /><a class="text-decoration-none hover-black" href="'+i.url+'"><h3 class="m0">'+i.title+"</h3></a>";if(i.content){o+='<p class="mt0">'+i.content.substring(0,150)+"...</p></li>"}}r.innerHTML=o}else{r.innerHTML='<li class="h2">No results found</li>'}}function e(t){var e=window.location.search.substring(1);var r=e.split("&");for(var o=0;o<r.length;o++){var n=r[o].split("=");if(n[0]===t){return decodeURIComponent(n[1].replace(/\+/g,"%20"))}}}var r=e("query");if(r){document.getElementById("search-box").setAttribute("value",r);var o=lunr(function(){this.field("id");this.field("title",{boost:10});this.field("author");this.field("category");this.field("content")});for(var n in window.store){o.add({id:n,title:window.store[n].title,author:window.store[n].author,category:window.store[n].category,content:window.store[n].content});var i=o.search(r);t(i,window.store)}}})();