//These data are defined here so that both server and client can access them.
global = {};
_.extend(global, {
	regions: [ "Americas", "Europe", "Asia" ],
	auctionDurations: [ 
		{ name: "30 Minutes", value: 30 },
		{ name: "1 Hour", value: 60 },
		{ name: "2 Hours", value: 120 }
	],
	bidIncrements: [ 
		{ name: "5k", value: 5000 },
		{ name: "10k", value: 10000 },
		{ name: "25k", value: 25000 },
		{ name: "50k", value: 50000 },
		{ name: "100k", value: 100000 },
		{ name: "200k", value: 200000 },
		{ name: "250k", value: 250000 },
		{ name: "500k", value: 500000 }
	],
});