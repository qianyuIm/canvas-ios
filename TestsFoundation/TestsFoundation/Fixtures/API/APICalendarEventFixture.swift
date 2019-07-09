//
// This file is part of Canvas.
// Copyright (C) 2019-present  Instructure, Inc.
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

extension APICalendarEvent {
    public static func make(
        id: ID = "1",
        html_url: URL = URL(string: "https://narmstrong.instructure.com/calendar?event_id=10&include_contexts=course_1")!,
        title: String = "calendar event #1",
        start_at: Date? = Date(fromISOString: "2018-05-18T06:00:00Z"),
        end_at: Date? = Date(fromISOString: "2018-05-18T06:00:00Z"),
        type: String? = "event",
        context_code: String = "course_1"
    ) -> APICalendarEvent {
        return APICalendarEvent(
            id: id,
            html_url: html_url,
            title: title,
            start_at: start_at,
            end_at: end_at,
            type: type,
            context_code: context_code
        )
    }
}
