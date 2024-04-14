module.exports = {
    define: table => {
        table.increments();
        table.string('title', 50);
        table.string('key', 30);
        table.string('script', 20);
        table.string('rule');
        table.timestamp('createTime');
        table.timestamp('modifyTime');
    }
};