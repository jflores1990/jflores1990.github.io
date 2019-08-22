var contactArray;

// All
var option1Array = ["All"];

// Administrative & Financial Management Services Division
var option2Array = ["All", "Accounting", "Administration Office", "Budgets Office", "Business Services Office", "Contracts, Grants & Loans", "Information Technology Services Branch", "Library", "Personnel and Labor Relations", "Selection and EEO"];

// Efficiency Division
var option3Array = ["All", "Appliances & Existing Building Office", "Buildings Standards Office", "ED Administration", "Local Assistance and Financing Office", "Renewable Energy Office", "Standards Implementation Office"];

// Electricity Assessments Division
var option4Array = ["All", "Demand Analysis Office", "EAD Administration", "Supply Analysis Office"];

// Energy Research & Development Division
var option5Array = ["All", "Admin Office", "Energy Deployment and Market Facilitation Office", "Energy Efficiency Research Office", "Energy Generation Research Office", "Energy System Research Office"];

// Fuels & Transportation Division
var option6Array = ["All", "Emerging Fuels & Technology Office", "FTD Administration", "Special Projects Office", "Transportation Energy Office"];

// Renewable Energy Division
var option7Array = ["All", "Renewable Energy Office"];

// Siting, Transmission & Environmental Protection Division
var option8Array = ["All", "Compliance Office", "Engineering Office", "Environmental Office", "Siting Office", "STEP Administration", "Strategic Transmission Planning and Corridor Designation Office"];

// Small Offices
var option9Array = ["All", "Commissioners Office", "Executive Office", "Hearing Advisers Office", "Media & Public Communications Office", "Office of Governmental Affairs", "Office of the Chief Counsel", "Public Adviser's Office"];

$.ajax({
	type: "GET",
	url: "assets/contactList.csv",
	dataType: "text",
	success: function(csv)
	{
		contactArray = $.csv.toArrays(csv);
		for(var i = 1; i < contactArray.length; i++)
		{
			if(contactArray[i][4] === "Contracts Grants & Loans")
			{
				contactArray[i][4] = "Contracts, Grants & Loans";
			}
		}
		console.log(contactArray);
	}
});

function search()
{
	var contactList = $("#contactList");
	var contactCount = 0;

	var lastName = $("#lastName").val();
	var firstName = $("#firstName").val();

	var division = $("#divisions").val();
	var office = $("#offices").find(":selected").text();

	var isFilterByDivision = division !== "1";
	var isFilterByOffice = office !== "All";

	contactList.empty();

	for(var i = 1; i < contactArray.length; i++)
	{
		var isAddContact = false;

		if((contactArray[i][0].toLowerCase().includes(lastName.toLowerCase().trim()) &&
				contactArray[i][1].toLowerCase().includes(firstName.toLowerCase().trim())))
		{
			if(!isFilterByDivision && !isFilterByOffice)
			{
				isAddContact = true;
			}
			else if(isFilterByOffice && contactArray[i][4] === office)
			{
				isAddContact = true;
			}
			else if(!isFilterByOffice && isFilterByDivision && isOfficeInDivision(contactArray[i][4], division))
			{
				isAddContact = true;
			}
		}

		if(isAddContact)
		{
			contactList.append("<li><a href=\"#\" id=\"" + i + "\" class=\"info-go\">" + contactArray[i][0] + ", " + contactArray[i][1] + "</a></li>");
			contactCount++;
		}
	}

	contactList.off("click").on("click", ".info-go", function(e)
	{
		e.preventDefault();
		$("#contact").data("contactInfo", contactArray[this.id]);
		$.mobile.changePage("#contact");
	});

	contactList.listview("refresh");

	document.getElementById("contactCount").innerHTML = contactCount + (contactCount === 1 ? " Contact" : " Contacts") + " Found";
}

function isOfficeInDivision(office, division)
{
	var officeArray;

	switch(division)
	{
		// All
		case "1":
			officeArray = option1Array;
			break;
		// Administrative & Financial Management Services Division
		case "2":
			officeArray = option2Array;
			break;
		// Efficiency Division
		case "3":
			officeArray = option3Array;
			break;
		// Electricity Assessments Division
		case "4":
			officeArray = option4Array;
			break;
		// Energy Research & Development Division
		case "5":
			officeArray = option5Array;
			break;
		// Fuels & Transportation Division
		case "6":
			officeArray = option6Array;
			break;
		// Renewable Energy Division
		case "7":
			officeArray = option7Array;
			break;
		// Siting, Transmission & Environmental Protection Division
		case "8":
			officeArray = option8Array;
			break;
		// Small Offices
		case "9":
			officeArray = option9Array;
			break;
	}

	for(var i = 0; i < officeArray.length; i++)
	{
		if(officeArray[i] === office)
		{
			return true;
		}
	}

	return false;
}

function reset()
{
	$("#contactList").empty();

	$("#firstName").val("");
	$("#lastName").val("");

	$("#divisions option:first").prop("selected","selected");
	$("#divisions").selectmenu("refresh");

	updateOptions($("#offices"), option1Array);
	$("#offices").selectmenu("disable");

	document.getElementById("contactCount").innerHTML = "";
}

function updateOffices(division)
{
	var offices = $("#offices")

	offices.selectmenu("enable");

	switch(division) {
		// All
		case "1":
			offices.selectmenu("disable");
			updateOptions(offices, option1Array);
			break;
		// Administrative & Financial Management Services Division
		case "2":
			updateOptions(offices, option2Array);
			break;
		// Efficiency Division
		case "3":
			updateOptions(offices, option3Array);
			break;
		// Electricity Assessments Division
		case "4":
			updateOptions(offices, option4Array);
			break;
		// Energy Research & Development Division
		case "5":
			updateOptions(offices, option5Array);
			break;
		// Fuels & Transportation Division
		case "6":
			updateOptions(offices, option6Array);
			break;
		// Renewable Energy Division
		case "7":
			updateOptions(offices, option7Array);
			break;
		// Siting, Transmission & Environmental Protection Division
		case "8":
			updateOptions(offices, option8Array);
			break;
		// Small Offices
		case "9":
			updateOptions(offices, option9Array);
			break;
	}
}

function updateOptions(select, optionArray)
{
	select.empty()

	for(var i = 0; i < optionArray.length; i++)
	{
		select.append($("<option></option>").attr("value", i + 1).text(optionArray[i]));
	}
	select.append($("<optgroup></optgroup>"));

	select.selectmenu("refresh");
}

$(document).on("pagebeforeshow", "#contact", function()
{
	var contactInfo = $(this).data("contactInfo");

	document.getElementById("fullName").innerHTML = contactInfo[1] + " " + contactInfo[0];

	document.getElementById("office").innerHTML = contactInfo[4];

	document.getElementById("phoneNumber").innerHTML = contactInfo[2] === "" ? "Phone Number Unavailable" : "(916) " + contactInfo[2];
	document.getElementById("phoneNumber").setAttribute("href", contactInfo[2] === "" ? "#" : "tel:(916)" + contactInfo[2]);

	document.getElementById("emailAddress").innerHTML = contactInfo[3] === "" ? "E-Mail Address Unavailable" : contactInfo[3];
	document.getElementById("emailAddress").setAttribute("href", contactInfo[3] === "" ? "#" : "mailto:" + contactInfo[3]);
});