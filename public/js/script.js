

const showAlert = (alertMessage) => 
{
    alert(alertMessage);
    window.setTimeout(() => {}, 2000);
}

const addNewLeadPopup = document.getElementById("AddNewLeadPopup");

function openAddNewLeadPopup() {
  addNewLeadPopup.style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closeAddNewLeadPopup() {
  addNewLeadPopup.style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

addNewLeadPopup.addEventListener("submit", (e) => { 
    
    e.preventDefault();

    console.log("Inside add new Lead submit done");
    const leadName = document.getElementById("leadName").value;
    const leadAddress = document.getElementById("leadAddress").value;
    const leadDate = document.getElementById("leadDate").value;
    const leadType = document.getElementById("leadType").value;
    const totalOrdersPlaced = document.getElementById("totalOrdersPlaced").value;

    // POC
    const contactName = document.getElementById('contactName').value;
    const contactRole = document.getElementById('contactRole').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const contactEmail = document.getElementById('contactEmail').value;
    
    createNewLeadFunction(leadName, leadAddress, leadDate, leadType, totalOrdersPlaced, contactName, contactRole, contactPhone, contactEmail);

});
  
const createNewLeadFunction = async function(leadName, leadAddress, leadDate, leadType, totalOrdersPlaced, contactName, contactRole, contactPhone, contactEmail)
{
    try
    {
        console.log("** FRONTEND: Inside createNewLeadFunction ** ");

        const result = await axios({
            method: 'POST',
            url: '/api/v1/leads/restaurants',
            data: {
                leadName,
                leadAddress,
                leadDate,
                leadType, 
                totalOrdersPlaced,
                contactName, 
                contactRole, 
                contactPhone, 
                contactEmail
            }
        });

        console.log(`Result: ${result}`);

        if (result.status === 'success')
        {
            showAlert('New restaurant added')
        }
        else
        {
            showAlert(`Error adding restaurant: ${result.message}`);
        }
    }
    catch (err)
    {
        // console.log(`err.response: `);
        showAlert(`Error: ${err.response.data.message}`)
    }
    
}