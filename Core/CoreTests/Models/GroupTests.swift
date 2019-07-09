//
// This file is part of Canvas.
// Copyright (C) 2018-present  Instructure, Inc.
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

import Foundation
import XCTest
@testable import Core

class GroupTests: CoreTestCase {
    func testColorWithNoLinkOrCourse() {
        let a = Group.make()
        _ = Color.make()

        XCTAssertEqual(a.color, .named(.ash))
    }

    func testColor() {
        let a = Group.make()
        _ = Color.make(canvasContextID: a.canvasContextID)

        XCTAssertEqual(a.color, .red)
    }

    func testColorWithCourseID() {
        let a = Group.make(from: .make(course_id: "1"))
        _ = Color.make()

        XCTAssertEqual(a.color, .red)
    }
}
