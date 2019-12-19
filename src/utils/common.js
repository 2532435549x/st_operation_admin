export function GetUrlRelativePath(){
　　　　var url = document.location.toString();
　　　　var arrUrl = url.split("/");
　　　　return arrUrl;
}

export function htmlContent(html){
        let htmlNode =  `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <title>appDetail</title>
            <style>
                *{
                    font-family: 微软雅黑;
                }
                #htmlContent img {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 15px 0;
                    display: block;
                }
                #htmlContent p,
                #htmlContent div {
                    font-size: 16px !important;
                    color: grey !important;
                    display: block !important;
                    font-family: Microsoft YaHei;
                }
            </style>
        </head>

        <body id="htmlContent">
            ${html}
        </body>
        </html>`
        return htmlNode;
}
