import type { PlayerStats, PlayerStatType } from "./types";

const ratio = (numerator: number, denominator: number) => {
	if (denominator > 0) {
		return numerator / denominator;
	}

	return 0;
};

const percentage = (numerator: number, denominator: number) => {
	return 100 * ratio(numerator, denominator);
};

const processStats = (
	ps: PlayerStats,
	stats: string[],
	statType?: PlayerStatType,
	bornYear?: number,
) => {
	const row: any = {};

	const g = ps.evG + ps.ppG + ps.shG;
	const a = ps.evA + ps.ppA + ps.shA;

	for (const stat of stats) {
		if (stat === "pts") {
			row[stat] = g + a;
		} else if (stat === "ps") {
			row[stat] = ps.ops + ps.dps + ps.gps;
		} else if (stat === "g") {
			row[stat] = g;
		} else if (stat === "a") {
			row[stat] = a;
		} else if (stat === "sa") {
			row[stat] = ps.sv + ps.ga;
		} else if (stat === "sPct") {
			row[stat] = percentage(g, ps.s);
		} else if (stat === "svPct") {
			row[stat] = percentage(ps.sv, ps.sv + ps.ga);
		} else if (stat === "foPct") {
			row[stat] = percentage(ps.fow, ps.fow + ps.fol);
		} else if (stat === "gaa") {
			row[stat] = ratio(ps.ga, ps.gp);
		} else if (stat === "amin") {
			row[stat] = ratio(ps.min, ps.gp);
		} else if (stat === "age") {
			if (bornYear === undefined) {
				throw new Error(
					"You must supply bornYear to processStats if you want age",
				);
			}

			row.age = ps.season - bornYear;
		} else if (stat === "keyStats") {
			const pts = g + a;

			let role: string | undefined;
			if (pts > 0 && pts >= ps.sv) {
				role = "skater";
			} else if (ps.sv > 0 && ps.sv >= pts) {
				role = "goalie";
			}

			if (role === "skater") {
				row[stat] = `${g} G, ${a} A, ${pts} P`;
			} else if (role === "goalie") {
				const svPct = percentage(ps.sv, ps.sv + ps.ga);
				const gaa = ratio(ps.ga, ps.gp);
				row[stat] = `${gaa.toFixed(2)} GAA, ${svPct.toFixed(1)} SV%`;
			} else {
				row[stat] = "";
			}
		} else {
			row[stat] = ps[stat];
		}

		// For keepWithNoStats
		if (
			(row[stat] === undefined || Number.isNaN(row[stat])) &&
			stat !== "jerseyNumber"
		) {
			row[stat] = 0;
		}
	}

	// Since they come in same stream, always need to be able to distinguish
	row.playoffs = ps.playoffs;
	return row;
};

export default processStats;