/*
 * @Author: ZHANGWENTAI
 * @LastEditTime: 2021-03-31 10:23:04
 * @Compile Option: 
 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} - [${level}]: ${message}`;
});
  
const Logger = createLogger({
    format: combine(
        timestamp(),
        format.colorize({ 
            colors: { info: 'blue', warning: 'orange', error:'red' },
            all: true
        }),
        myFormat,
    ),
    transports: [new transports.Console()]
});

module.exports = Logger;