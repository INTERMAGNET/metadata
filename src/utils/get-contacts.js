/**
 * Extracts and transforms contact details from WDC API response
 * @param {Object} state - Application state containing observatory data
 * @author Adam Emsley, British Geological Survey <adam.emsley@bgs.ac.uk>
**/
const getContacts = function getContacts(state) {

	// get data
	const data = state.data.data;
	const uniqueContacts = new Set();
	const result = {};

	data
		.forEach(entry => {
			entry.persons.forEach(person => {
				const nameID = `${person.family_name}_${person.given_name}`;
				if (!uniqueContacts.has(nameID)) {
					uniqueContacts.add(nameID);

					// user boolean filter to get full name
					const nameParts = [person.title, person.given_name, person.family_name].filter(Boolean);
					const name = nameParts.join(' ');
					const emails = [
						...(person.email ? [person.email] : []),
						...(person.email2 ? [person.email2] : []),

					];

					const tel1 = person.phone;
					const tel2 = person.phone2;
					const fax = person.fax;
					
					// use spread operator to add fields that are in database
					const address = [
						{
							...(person.address1 && { address1: person.address1 }),
							...(person.address2 && { address2: person.address2 }),
							...(person.address3 && { address3: person.address3 }),
							...(person.address4 && { address4: person.address4 }),
							...(person.address5 && { address5: person.address5 }),
							...(person.city && { city: person.city }),
							...(person.state && { state: person.state }),
							...(person.lang && { lang: person.lang }),
							...(person.postcode && { postcode: person.postcode }),
							...(person.country && { country: person.country }),
						}
					];

					result[nameID] = {
						"addresses": address,
						"name": name,
						"emails": emails,
						...(tel1 != null && { "tel": tel1 }),
						...(tel2 != null && { "tel2": tel2 }),
						"fax": fax
					};
				}
			});
		});
	
	return result;
}

// export
export default getContacts;