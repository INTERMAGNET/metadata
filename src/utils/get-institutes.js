/**
 * Extracts and transforms institute details from WDC API response
 * @param {Object} state - Application state containing observatory data
 * @author Adam Emsley, British Geological Survey <adam.emsley@bgs.ac.uk>
**/
const getInstDetails =  function getInstDetails(state) {

	// get data from JSON
	const data = state.data.data;
	const uniqueInstitutes = new Set();

	const result = [];

	// loop over observatories
	data
		// filter to get currently open intermagnet observatories
		.filter(entry =>
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

				// push required structure
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

// export
export default getInstDetails;