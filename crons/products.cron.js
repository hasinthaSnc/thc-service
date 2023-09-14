const { syncProductsOtherProductsWithTLC } = require("../helpers/products.helper");
const cron = require('node-cron');

const startProductSyncCron = async () => {
    const cronSchedule = "*/5 * * * *";
    const job = cron.schedule(cronSchedule, syncProductsOtherProductsWithTLC);
  
    // Start the cron job
    job.start();
  }

module.exports = {
    startProductSyncCron,
};
