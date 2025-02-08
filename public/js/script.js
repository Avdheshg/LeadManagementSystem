

const showAlert = (alertMessage) => 
{
    alert(alertMessage);
    window.setTimeout(() => {}, 2000);
}


const addNewLeadPopup = document.getElementById("AddNewLeadPopup");

const fillDefaultValuesToLeadPopup = function()
{   
    console.log("** FRONTEND: Inside fillDefaultValuesToLeadPopup ** ");
    
    document.getElementById("leadName").value = "";
    document.getElementById("leadAddress").value = "";  
    document.getElementById("leadDate").value = "";
    document.getElementById("leadType").value = "";
    document.getElementById("totalOrdersPlaced").value = "";
    document.getElementById("source").value = "";
    document.getElementById("assignedTo").value = "";
    
    // poc
    document.getElementById("contactName").value = "";
    document.getElementById("contactRole").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    
}

function openAddNewLeadPopup() {
    console.log("** FRONTEND: Inside openAddNewLeadPopup ** ");

    document.getElementById("AddNewLeadPopup__heading").textContent = "Add Lead";
    document.getElementById("AddNewLeadPopup__editOrAddButton").textContent = "Add Lead";
    fillDefaultValuesToLeadPopup();
    
    makeAddOrEditLeadPopupVisible();
}

const makeAddOrEditLeadPopupVisible = function()
{
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

const opneAddOrEditLeadPopup = function(lead)
{
    console.log("** FRONTEND: Inside opneAddOrEditLeadPopup ** ");

    const textContent = document.getElementById("AddNewLeadPopup__heading").textContent = "Edit Lead";
    console.log(document.getElementById("AddNewLeadPopup__heading"));
    console.log(textContent);
    document.getElementById("AddNewLeadPopup__editOrAddButton").textContent = "Save";

    fillAllElementValuesOfLeadPopup(lead);
   
    makeAddOrEditLeadPopupVisible();
}

const fillAllElementValuesOfLeadPopup = function(lead)
{   
    console.log("** FRONTEND: Inside fillAllElementValuesOfLeadPopup ** "); 

    let date = getFormattedDate(lead.leadDate);
    console.log(lead.source);
    document.getElementById("leadName").value = lead.leadName;
    document.getElementById("leadAddress").value = lead.address;  
    document.getElementById("leadDate").value = date;
    document.getElementById("leadType").value = lead.leadType;
    document.getElementById("totalOrdersPlaced").value = lead.totalOrdersPlaced;
    document.getElementById("source").value = lead.source;
    document.getElementById("assignedTo").value = lead.assignedTo;
    
    // poc
    document.getElementById("contactName").value = lead.pointOfContact[0].name;
    document.getElementById("contactRole").value = lead.pointOfContact[0].role;
    document.getElementById("contactPhone").value = lead.pointOfContact[0].phone;
    document.getElementById("contactEmail").value = lead.pointOfContact[0].email;
    
}

const getFormattedDate = function(inputDate)
{
    console.log("** FRONTEND: Inside getFormattedDate ** ");

    let date = new Date(inputDate);

    const currMonth = date.getMonth() < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    const currDayNumberOfMonth = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();

    return `${date.getFullYear()}-${currMonth}-${currDayNumberOfMonth}`
}