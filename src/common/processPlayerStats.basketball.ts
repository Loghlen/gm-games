import type { PlayerStats, PlayerStatType } from "./types";

const straightThrough = [
	"gp",
	"gs",
	"per",
	"ewa",
	"yearsWithTeam",
	"astp",
	"blkp",
	"drbp",
	"orbp",
	"stlp",
	"trbp",
	"usgp",
	"drtg",
	"ortg",
	"dws",
	"ows",
];

const percentage = (numerator: number, denominator: number) => {
	if (denominator > 0) {
		return (100 * numerator) / denominator;
	}

	return 0;
};

const processStats = (
	ps: PlayerStats,
	stats: string[],
	statType: PlayerStatType,
	bornYear: number,
) => {
	const row: any = {};

	for (const stat of stats) {
		let scale = true;
		if (straightThrough.includes(stat)) {
			row[stat] = ps[stat];
			scale = false;
		} else if (stat === "2pp") {
			row[stat] = percentage(ps.fg - ps.tp, ps.fga - ps.tpa);
			scale = false;
		} else if (stat === "fgp") {
			row[stat] = percentage(ps.fg, ps.fga);
			scale = false;
		} else if (stat === "fgpAtRim") {
			row[stat] = percentage(ps.fgAtRim, ps.fgaAtRim);
			scale = false;
		} else if (stat === "fgpLowPost") {
			row[stat] = percentage(ps.fgLowPost, ps.fgaLowPost);
			scale = false;
		} else if (stat === "fgpMidRange") {
			row[stat] = percentage(ps.fgMidRange, ps.fgaMidRange);
			scale = false;
		} else if (stat === "tpp") {
			row[stat] = percentage(ps.tp, ps.tpa);
			scale = false;
		} else if (stat === "ftp") {
			row[stat] = percentage(ps.ft, ps.fta);
			scale = false;
		} else if (stat === "tsp") {
			row[stat] = percentage(ps.pts, 2 * (ps.fga + 0.44 * ps.fta));
			scale = false;
		} else if (stat === "tpar") {
			row[stat] = percentage(ps.tpa, ps.fga);
			scale = false;
		} else if (stat === "ftr") {
			row[stat] = percentage(ps.fta, ps.fga);
			scale = false;
		} else if (stat === "tovp") {
			row[stat] = percentage(ps.tov, ps.fga + 0.44 * ps.fta + ps.tov);
			scale = false;
		} else if (stat === "season") {
			row.season = ps.season;
			scale = false;
		} else if (stat === "age") {
			row.age = ps.season - bornYear;
			scale = false;
		} else if (stat === "ws") {
			row.ws = ps.dws + ps.ows;
			scale = false;
		} else if (stat === "ws48") {
			row.ws48 = ((ps.dws + ps.ows) * 48) / ps.min;
			scale = false;
		} else if (stat === "trb") {
			row[stat] = ps.drb + ps.orb;
		} else if (stat === "2p") {
			row[stat] = ps.fg - ps.tp;
		} else if (stat === "2pa") {
			row[stat] = ps.fga - ps.tpa;
		} else {
			row[stat] = ps[stat];
		}

		if (scale) {
			// Either the raw stat from database, or something added up above (trb, 2p, 2pa)
			const val = row[stat] !== undefined ? row[stat] : ps[stat];
			if (statType === "totals") {
				row[stat] = val;
			} else if (statType === "per36" && stat !== "min") {
				row[stat] = ps.min > 0 ? (val * 36) / ps.min : 0;
			} else {
				row[stat] = ps.gp > 0 ? val / ps.gp : 0;
			}
		}

		// For keepWithNoStats
		if (row[stat] === undefined || Number.isNaN(row[stat])) {
			row[stat] = 0;
		}
	}

	// Since they come in same stream, always need to be able to distinguish
	row.playoffs = ps.playoffs;
	return row;
};

export default processStats;