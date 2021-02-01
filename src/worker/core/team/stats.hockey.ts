const teamAndOpp = [
	"pim",
	"evG",
	"ppG",
	"shG",
	"evA",
	"ppA",
	"shA",
	"gwA",
	"s",
	"tsa",
	"fow",
	"fol",
	"blk",
	"hit",
	"tk",
	"gv",
	"ga",
	"sv",

	// KEEP THIS IN SYCN WITH ABOVE! TypeScript needs them to be listed explicitly. Used to be:
	// ...teamAndOpp.map(stat => `opp${helpers.upperCaseFirstLetter(stat)}`),
	"oppPim",
	"oppEvG",
	"oppPpG",
	"oppShG",
	"oppEvA",
	"oppPpA",
	"oppShA",
	"oppGwA",
	"oppS",
	"oppTsa",
	"oppFow",
	"oppFol",
	"oppBlk",
	"oppHit",
	"oppTk",
	"oppGv",
	"oppGa",
	"oppSv",
] as const;

// raw: recorded directly in game sim
// derived: still stored in database, but not directly recorded in game sim
// not present in this file: transiently derived things, like FG%
const stats = {
	derived: ["qs", "rbs", "so", "oppQs", "oppRbs", "oppSo"],
	raw: ["gp", "min", ...teamAndOpp] as const,
};

export default stats;
