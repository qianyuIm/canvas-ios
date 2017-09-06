//
// Copyright (C) 2016-present Instructure, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// @flow

import api from './apis/index'
import client from './httpClient'

export default api
export * from './apis/assignmentGroups'
export * from './apis/assignments'
export * from './apis/conversations'
export * from './apis/courses'
export * from './apis/discussions'
export * from './apis/enrollments'
export * from './apis/external-tools'
export * from './apis/groups'
export * from './apis/login'
export * from './apis/quizzes'
export * from './apis/submissions'
export * from './apis/users'

export * from './session'
export const httpClient = client
