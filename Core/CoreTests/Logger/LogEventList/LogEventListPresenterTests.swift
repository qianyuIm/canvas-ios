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

class LogEventListPresenterTests: CoreTestCase {
    class View: LogEventListViewProtocol {
        var navigationController: UINavigationController?
        var reloadDataExpectation = XCTestExpectation()

        func reloadData() {
            reloadDataExpectation.fulfill()
        }
    }

    var presenter: LogEventListPresenter!
    let view = View()

    override func setUp() {
        super.setUp()

        presenter = LogEventListPresenter(env: environment, view: view)
    }

    func testApplyFilter() {
        LogEvent.make(type: .log)
        LogEvent.make(type: .error)
        presenter.viewIsReady()
        XCTAssertEqual(presenter.events.count, 2)

        view.reloadDataExpectation = XCTestExpectation()
        presenter.applyFilter(.log)

        wait(for: [view.reloadDataExpectation], timeout: 0.1)
        XCTAssertEqual(presenter.events.count, 1)
        let event = presenter.events[IndexPath(row: 0, section: 0)]
        XCTAssertEqual(event?.type, .log)
    }

    func testClearFilter() {
        LogEvent.make(type: .log)
        LogEvent.make(type: .error)
        presenter.viewIsReady()
        XCTAssertEqual(presenter.events.count, 2)

        // Filter to only show errors
        view.reloadDataExpectation = XCTestExpectation()
        presenter.applyFilter(.log)
        wait(for: [view.reloadDataExpectation], timeout: 0.1)
        XCTAssertEqual(presenter.events.count, 1)

        // Apply filter back to nil
        view.reloadDataExpectation = XCTestExpectation()
        presenter.applyFilter(nil)
        wait(for: [view.reloadDataExpectation], timeout: 0.1)
        XCTAssertEqual(presenter.events.count, 2)
    }
}
