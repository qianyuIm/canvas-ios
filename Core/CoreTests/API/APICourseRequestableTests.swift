//
// This file is part of Canvas.
// Copyright (C) 2016-present  Instructure, Inc.
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

class APICourseRequestableTests: XCTestCase {
    func testGetCoursesRequest() {
        XCTAssertEqual(GetCoursesRequest(includeUnpublished: false).path, "courses")
        XCTAssertEqual(GetCoursesRequest(includeUnpublished: false).queryItems, [
            URLQueryItem(name: "include[]", value: "course_image"),
            URLQueryItem(name: "include[]", value: "current_grading_period_scores"),
            URLQueryItem(name: "include[]", value: "favorites"),
            URLQueryItem(name: "include[]", value: "observed_users"),
            URLQueryItem(name: "include[]", value: "sections"),
            URLQueryItem(name: "include[]", value: "term"),
            URLQueryItem(name: "include[]", value: "total_scores"),
            URLQueryItem(name: "state[]", value: "available"),
            URLQueryItem(name: "state[]", value: "completed"),
            URLQueryItem(name: "per_page", value: "10"),
        ])
        XCTAssertEqual(GetCoursesRequest(includeUnpublished: true, perPage: 20).queryItems, [
            URLQueryItem(name: "include[]", value: "course_image"),
            URLQueryItem(name: "include[]", value: "current_grading_period_scores"),
            URLQueryItem(name: "include[]", value: "favorites"),
            URLQueryItem(name: "include[]", value: "observed_users"),
            URLQueryItem(name: "include[]", value: "sections"),
            URLQueryItem(name: "include[]", value: "term"),
            URLQueryItem(name: "include[]", value: "total_scores"),
            URLQueryItem(name: "state[]", value: "available"),
            URLQueryItem(name: "state[]", value: "completed"),
            URLQueryItem(name: "state[]", value: "unpublished"),
            URLQueryItem(name: "per_page", value: "20"),
        ])
    }

    func testGetCourseRequest() {
        XCTAssertEqual(GetCourseRequest(courseID: "2").path, "courses/2")
        XCTAssertEqual(GetCourseRequest(courseID: "2").queryItems, [
            URLQueryItem(name: "include[]", value: "course_image"),
            URLQueryItem(name: "include[]", value: "current_grading_period_scores"),
            URLQueryItem(name: "include[]", value: "favorites"),
            URLQueryItem(name: "include[]", value: "permissions"),
            URLQueryItem(name: "include[]", value: "sections"),
            URLQueryItem(name: "include[]", value: "term"),
            URLQueryItem(name: "include[]", value: "total_scores"),
            URLQueryItem(name: "include[]", value: "syllabus_body"),
        ])
    }

    func testUpdateCourseRequest() {
        let params = APICourseParameters(name: "Cracking Wise", default_view: .wiki)
        let body = PutCourseRequest.Body(course: params)
        XCTAssertEqual(PutCourseRequest(courseID: "2", body: body).method, .put)
        XCTAssertEqual(PutCourseRequest(courseID: "2", body: body).path, "courses/2")
        XCTAssertEqual(PutCourseRequest(courseID: "2", body: body).body, body)
    }

    func testCreateCourseRequest() {
        let params = APICourseParameters(name: "name", default_view: .assignments)
        let body = PostCourseRequest.Body(course: params)
        let request = PostCourseRequest(accountID: "1", body: body)

        XCTAssertEqual(request.path, "accounts/1/courses")
        XCTAssertEqual(request.method, .post)
        XCTAssertEqual(request.body, body)
    }
}
