/**
 * Extracts and transforms observatory details from WDC API response
 * @param {Object} state - Application state containing observatory data
 * @author Adam Emsley, British Geological Survey <adam.emsley@bgs.ac.uk>
**/
const getObsDetails = function getObsDetails(state) {

	// get data from JSON
	const data = state.data.data || [];
	const result = [];

	// loop over observatories
	data.forEach(entry => {
		const {
			observatory_iaga_code: iaga,
			attributes,
			address = [], // default to empty array if not found
			instruments = [],
			persons = [],
			intermagnet = [],
			institutes = [],
			locations = []
		} = entry;

		// filter by intermagnet observatories
		if (!intermagnet || intermagnet.length === 0) return;

		// Find an entry where member_to is null (open)
		let inter = intermagnet.find(entry => entry.member_to === null);
		
		// If none are open, use the last one
		if (!inter) {
			inter = intermagnet[intermagnet.length - 1];
		}
		
		let openClosed = inter.member_to ? 'closed' : 'imo';
		const location = locations[0] || {};
		const lat = parseFloat(location.latitude);
		const lon = parseFloat(location.longitude);
		const elevation = parseFloat(location.elevation);
		const latitude_region = lat >= 0 ? 'NH' : 'SH';

		const orientations = Array.from(
			new Set(instruments.map(inst => inst.orientation).filter(Boolean))
		).join('|');

		const gin = inter.intermagnet_gin_code || undefined;
		const communication = inter.gin_comms || undefined;
		const publication_del = inter.publication_delay != null
			? [String(inter.publication_delay), "source", "delay"]
			: ["source", "delay"];

		const contacts = persons.map(p =>
			`${p.family_name}_${p.given_name}`.replace(/\s+/g, '')
		);

		const instruments_ml = [];
		const lines = instruments
			.map(inst => inst.instrument_name && inst.instrument_name.trim())
			.filter(Boolean);

		if (lines.length) {
			instruments_ml.push({ lang: 'en', lines });
		} else {
			instruments_ml.push({});
		}

		let country = '';
		if (address.length > 0 && address[0].country) {
			const match = address[0].country.match(/\((\w+)\)/);
			if (match && match[1]) {
				country = match[1].toLowerCase();
			}
		}
		
		// push structure needed for intermagnet UI
		result.push({
			id: iaga,
			iaga,
			name: attributes.name,
			elevation,
			region: location.region || '',
			gin,
			communication,
			institutes: institutes.map(inst => inst.abbreviation).filter(Boolean),
			latitude: lat,
			latitude_region,
			longitude: lon,
			contacts,
			orientation: orientations,
			publication: publication_del,
			status: openClosed,
			instruments_ml,
			country
		});
	});

	return result;
}

// export
export default getObsDetails;