const getObsDetails = function getObsDetails(state) {
	const data = state.data.data || [];
	const result = [];

	data.forEach(entry => {
		const {
			observatory_iaga_code: iaga,
			attributes,
			address = [],
			instruments = [],
			persons = [],
			intermagnet = [],
			institutes = [],
			locations = []
		} = entry;

		const inter = intermagnet[0];
		if (!inter) return;

		let openClosed = 'imo';
		if (inter.member_to) {
			openClosed = 'closed';
		}

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
		const publication = [inter.plot_delay, "source", "delay"] || undefined;

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
			orientation: orientations || undefined,
			publication: publication || undefined,
			status: openClosed,
			instruments_ml,
			country
		});
	});

	return result;
}


export default getObsDetails