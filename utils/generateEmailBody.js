module.exports = function generateEmailBody(title, message) {
  return `<div style="border: 1px solid gray; height: 400px; width: 400px display: block; border-radius: 20px; padding: 10px; margin-left: 10px;">
  <h3>${title}</h3>
   <article>${message}</article>
   <p>Best regards,</p>
   <p>Your Ventorify Purchasing Team.</p>
  </div>`;
};
