const getContacts = function getContacts(state) {
	const data = state.data.data;
	const uniqueContacts = new Set();
	const result = {};

	data
		.filter(entry =>
			Array.isArray(entry.intermagnet) &&
			entry.intermagnet.length > 0 &&
			entry.institutes.length > 0
		)
		.forEach(entry => {
			entry.persons.forEach(person => {
				const nameID = `${person.family_name}_${person.given_name}`;
				if (!uniqueContacts.has(nameID)) {
					uniqueContacts.add(nameID);

					const nameParts = [person.title, person.given_name, person.family_name].filter(Boolean);
					const name = nameParts.join(' ');
					const emails = [
						...(person.email2 ? [person.email2] : []),
						person.email
					];

					result[nameID] = {
						addresses: [],
						name,
						emails
					};
				}
			});
		});

	return result;
}

export default getContacts