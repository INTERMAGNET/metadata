const getInstDetails =  function getInstDetails(state) {
	const data = state.data.data;
	const uniqueInstitutes = new Set();

	const result = [];

	data
		.filter(entry =>
			Array.isArray(entry.intermagnet) &&
			entry.intermagnet.length > 0 &&
			!entry.intermagnet[0]['member_to'] &&
			entry.institutes.length > 0
		)
		.forEach(entry => {
			const address = entry.address && entry.address[0];

			const rawCountry =
				(address && address.country) ||
				(entry.institutes[0] && entry.institutes[0].country) ||
				'';

			const match = rawCountry.match(/\((\w+)\)$/);
			const countryCode = match ? match[1] : '';

			entry.institutes.forEach(institute => {
				const name = institute.institute_name;
				const abbr = institute.abbreviation;
				const link = institute.institute_url;

				if (!uniqueInstitutes.has(name)) {
					uniqueInstitutes.add(name);
					result.push({
						id: abbr,
						country: countryCode,
						names: [{ abbr, name }],
						links: link ? [{ link }] : []
					});
				}
			});
		});

	return result;
}

export default getInstDetails