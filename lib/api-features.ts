/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ParsedUrlQuery } from "querystring";
import type { Query } from "mongoose";

class APIFeatures {
	dbQuery: Query<any[], any, {}, any>;
	urlQuery: ParsedUrlQuery;

	constructor(dbQuery: Query<any[], any, {}, any>, urlQuery: ParsedUrlQuery) {
		this.dbQuery = dbQuery;
		this.urlQuery = urlQuery;
	}

	filter() {
		const urlQueryCopy = JSON.parse(
			JSON.stringify(this.urlQuery).replace(
				/\blt|lte|gt|gte|ne|regex|options\b/g,
				match => `$${match}`
			)
		);

		for (const specialField of ["sort", "limit", "page"])
			delete urlQueryCopy[specialField];

		this.dbQuery.find(urlQueryCopy);

		return this;
	}

	sort() {
		if (this.urlQuery.sort) this.dbQuery.sort(this.urlQuery.sort);
		else this.dbQuery.sort("-createdAt");

		return this;
	}

	paginate() {
		const limit = Number(this.urlQuery.limit) || 10,
			page = Number(this.urlQuery.page) || 1;

		this.dbQuery.limit(limit).skip((page - 1) * limit);

		return this;
	}

	async execute() {
		return await this.dbQuery;
	}
}

export default APIFeatures;
