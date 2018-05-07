const SerialPort = require('serialport');
const port = new SerialPort('com3', {
  baudRate: 128000 
});



// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

port.on('data', function (data) {
  //console.log('Data:', data);
  //console.log('len=' +data.length);
  if (data[0] === 0xaa && data[1] === 0x55) {
     const fsa = (data[4] | (data[5] << 8))/128;
     const lsa = (data[6] | (data[7] << 8))/128;
     console.log(`fs ${fsa} lsa ${lsa}`);
  }
});


function sleep(ms) {
  return new Promise(resolve=>{
     setTimeout(resolve, ms);
  });
}

function serWrite(buf) {
   return new Promise((resolve,reject)=>{
      port.write(buf, function(err) {
        if (err) {
          reject(err);
          return console.log('Error on write: ', err.message);
        }        
        resolve();
      });
   });
}
async function test() {
   console.log('sleeping');
   let buf = Buffer.from([0xA5,0x90]);  
   await serWrite(buf);
   await serWrite(Buffer.from([0xA5,0x60]));
   await sleep(2000);
   await serWrite(Buffer.from([0xA5,0x65]));
   console.log('done');  
}

test();