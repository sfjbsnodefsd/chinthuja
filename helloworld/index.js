/*console.log("Hello, it's me Chinthuja")

const http =require('http');
http.createServer((req,resp)=>{
resp.write("Helloworld")
resp.end()
}).listen(5000);*/
const http = require('http');
function greet(req,resp)
{
    resp.writeHead(200,{'Content-Type':'application/json'});
    resp.write(JSON.stringify({
        "name":"Chinthuja",
        "Empid":"001",
        "address":{"city":"TVM",
                 "state":"Kerala"
        }

    })),
        
    resp.end()
}
http.createServer(greet).listen(5000);