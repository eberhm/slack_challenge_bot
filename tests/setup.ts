
process.on('unhandledRejection', (err: Error) => {
    throw new Error(err.message);
});