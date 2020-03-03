//
// This file is part of Canvas.
// Copyright (C) 2020-present  Instructure, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

import XCTest
@testable import Core

class APIPlannableTests: XCTestCase {
    var req: GetPlannablesRequest!

    override func setUp() {
        super.setUp()
        req = GetPlannablesRequest()
    }

    func testPath() {
        XCTAssertEqual(req.path, "planner/items")
    }

    func testPathWithUserID() {
        req = GetPlannablesRequest(userID: "1", startDate: nil, endDate: nil, contextCodes: [], filter: "")
        XCTAssertEqual(req.path, "users/1/planner/items")
    }

	func testQuery() {
        let start = Date().addDays(-1)
        let end = Date().addDays(2)
        req = GetPlannablesRequest(startDate: start, endDate: end, contextCodes: ["course_1"], filter: "new_activity")
        let expected = [
            URLQueryItem(name: "per_page", value: "100"),
            URLQueryItem(name: "start_date", value: start.isoString()),
            URLQueryItem(name: "end_date", value: end.isoString()),
            URLQueryItem(name: "context_codes[]", value: "course_1"),
            URLQueryItem(name: "filter", value: "new_activity"),
        ]
		XCTAssertEqual(req.queryItems, expected)
	}

	func testModel() {
		let model = APIPlannable.make()
		XCTAssertNotNil(model)

        let override = APIPlannerOverride.make()
        XCTAssertNotNil(override)
	}
}
