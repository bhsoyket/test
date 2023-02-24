var CheckBubbleExist= document.getElementById('CGAPI')
if (CheckBubbleExist==null){
    (function (s, a, l, u, t, e) {
        t = a.createElement(l),
            e = a.getElementsByTagName(l)[0];
        t.async = 1;
        t.src = u;
        t.id="CGAPI"
        e.parentNode.insertBefore(t, e)
    })(window, document, 'script', 'https://completegreet.com/js/CompleteGreetAPI.js?v12345678');

}