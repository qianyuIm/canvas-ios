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

public class UITestUser {
    public static let readStudent1 = UITestUser(.testReadStudent1)
    public static let readStudent2 = UITestUser(.testReadStudent2)
    public static let readTeacher1 = UITestUser(.testReadTeacher1)
    public static let ldapUser = UITestUser(.testLDAPUser)
    public static let notEnrolled = UITestUser(.testNotEnrolled)

    public let host: String
    public let username: String
    public let password: String
    public var keychainEntry: KeychainEntry?

    public var profile: String {
        return """
            <dict>
                <key>enableLogin</key><true/>
                <key>users</key>
                <array>
                    <dict>
                        <key>host</key><string>\(host)</string>
                        <key>username</key><string>\(username)</string>
                        <key>password</key><string>\(password)</string>
                    </dict>
                </array>
            </dict>
        """
        .replacingOccurrences(of: "[\\n\\s]", with: "", options: .regularExpression, range: nil)
    }

    private init(_ secret: Secret) {
        // crash tests if secret is invalid or missing
        let url = URLComponents.parse(secret.string!)
        host = url.host!
        username = url.user!
        password = url.password!
    }
}