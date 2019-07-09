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
@testable import Core
import TestsFoundation
import XCTest

class LoginStartTests: StudentUITestCase {
    func testHiddenElements() {
        show(Route.login.url.path)
        XCTAssertFalse(LoginStart.helpButton.isVisible)
        XCTAssertFalse(LoginStart.whatsNewLabel.isVisible)
        XCTAssertFalse(LoginStart.whatsNewLink.isVisible)
    }

    func testFindSchool() {
        show(Route.login.url.path)
        XCTAssertTrue(LoginStart.findSchoolButton.isEnabled)
        LoginStart.findSchoolButton.tap()

        LoginFindSchool.searchField.waitToExist()
    }

    func testCanvasNetwork() {
        show(Route.login.url.path)
        XCTAssertTrue(LoginStart.canvasNetworkButton.isEnabled)
        LoginStart.canvasNetworkButton.tap()

        LoginWeb.webView.waitToExist()
    }
}
