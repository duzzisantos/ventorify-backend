//Template for serving email address. Style accordingly

module.exports = function generateEmailContent(
  product,
  category,
  reorderQuantity
) {
  return `<div style="border: 1px solid gray; height: 400px; width: 400px display: block; border-radius: 20px;">
  <h3>Purchase Request for ${product}</h3> <h4>Here are the details below:</h4> 
  <ul>
   <ol>Category: ${category}</ol>
   <ol>Quantity: ${reorderQuantity}</ol>
   <ul> 
   
   <p>Please communicate to us soon with regards delivery date or any change in plans or prices.</p>
   <p>Best regards,</p>
   <p>Your Ventorify Purchasing Team.</p>
  </div>`;
};
