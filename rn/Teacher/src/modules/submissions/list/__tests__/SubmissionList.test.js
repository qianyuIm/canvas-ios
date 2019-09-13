//
// This file is part of Canvas.
// Copyright (C) 2017-present  Instructure, Inc.
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

/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react'
import {
  SubmissionList,
  props as graphqlProps,
} from '../SubmissionList'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import defaultFilterOptions, { updateFilterSelection } from '../../../filter/filter-options'
import * as templates from '../../../../canvas-api-v2/__templates__'

const template = {
  ...require('../../../../__templates__/helm'),
}

jest
  .mock('../../../../routing')
  .mock('Alert', () => ({
    alert: jest.fn(),
  }))
  .mock('knuth-shuffle-seeded', () => jest.fn())

const submissions = [
  templates.submission({
    state: 'unsubmitted',
    grade: null,
    submittedAt: null,
    user: templates.user({
      name: 'S1',
      id: '1',
    }),
  }),
  templates.submission({
    gradingStatus: 'graded',
    state: 'graded',
    excused: true,
    grade: 'excused',
    submittedAt: null,
    user: templates.user({
      name: 'S2',
      id: '2',
    }),
  }),
  templates.submission({
    state: 'submitted',
    late: true,
    gradingStatus: 'needs_grading',
    grade: null,
    user: templates.user({
      name: 'S3',
      id: '3',
    }),
  }),
  templates.submission({
    state: 'submitted',
    grade: 'A-',
    user: templates.user({
      name: 'S4',
      id: '4',
    }),
  }),
]

const props = {
  submissions: submissions,
  pending: false,
  courseID: '12',
  assignmentID: '32',
  courseColor: '#ddd',
  courseName: 'fancy name',
  anonymous: false,
  muted: false,
  assignmentName: 'Blah',
  groupAssignment: null,
  sections: [templates.section()],
  isGroupGradedAssignment: false,
  refetch: jest.fn(),
}

beforeEach(() => jest.resetAllMocks())

test('SubmissionList loaded', () => {
  const tree = renderer.create(
    <SubmissionList {...props} navigator={template.navigator()} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SubmissionList shows loading indicator', () => {
  const tree = renderer.create(
    <SubmissionList {...props} navigator={template.navigator()} pending={true} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

test('SubmissionList select filter function', () => {
  const instance = renderer.create(
    <SubmissionList { ...props } navigator={template.navigator()} />
  ).getInstance()

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'all'))
  expect(instance.state.filter).toEqual({
    late: null,
    scoredLessThan: null,
    scoredMoreThan: null,
    sectionIDs: [],
    states: ['submitted', 'unsubmitted', 'pending_review', 'graded', 'ungraded'],
    gradingStatus: null,
  })
  expect(props.refetch).toHaveBeenCalledTimes(1)

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'late'))
  expect(instance.state.filter).toMatchObject({
    late: true,
  })
  expect(props.refetch).toHaveBeenCalledTimes(2)

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'not_submitted'))
  expect(instance.state.filter).toMatchObject({
    states: ['unsubmitted'],
  })
  expect(props.refetch).toHaveBeenCalledTimes(3)

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'ungraded'))
  expect(instance.state.filter).toMatchObject({
    gradingStatus: 'needs_grading',
  })
  expect(props.refetch).toHaveBeenCalledTimes(4)

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'lessthan', 50))
  expect(instance.state.filter).toMatchObject({
    scoredLessThan: 50,
  })
  expect(props.refetch).toHaveBeenCalledTimes(5)

  instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'morethan', 50))
  expect(instance.state.filter).toMatchObject({
    scoredMoreThan: 50,
  })
  expect(props.refetch).toHaveBeenCalledTimes(6)

  // Cancel
  instance.applyFilter(defaultFilterOptions())
  expect(instance.state.filter).toEqual({
    late: null,
    scoredLessThan: null,
    scoredMoreThan: null,
    sectionIDs: [],
    states: ['submitted', 'unsubmitted', 'pending_review', 'graded', 'ungraded'],
    gradingStatus: null,
  })
  expect(props.refetch).toHaveBeenCalledTimes(7)
})

test('SubmissionList renders correctly with empty list', () => {
  const tree = renderer.create(
    <SubmissionList {...props} submissions={[]} navigator={template.navigator()} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

test('should navigate to submission settings', () => {
  let navigator = template.navigator({
    show: jest.fn(),
  })

  const tree = renderer.create(
    <SubmissionList {...props} navigator={navigator} />
  )
  tree.getInstance().openSettings()

  expect(navigator.show).toHaveBeenCalledWith('/courses/12/assignments/32/submission_settings', { modal: true })
})

test('should navigate to post policy settings', () => {
  let navigator = template.navigator({
    show: jest.fn(),
  })

  const tree = renderer.create(
    <SubmissionList {...props} navigator={navigator} />
  )
  tree.getInstance().openPostPolicy()

  expect(navigator.show).toHaveBeenCalledWith('/courses/12/assignments/32/post_policy', { modal: true })
})

test('should show eye button if new gradebook enabled', async () => {
  let navigator = template.navigator({
    show: jest.fn(),
  })

  let tree = shallow(
    <SubmissionList {...props} navigator={navigator} />
  )

  await new Promise(resolve => tree.setState({ flags: ['new_gradebook'] }, resolve))
  const button = tree.find('Screen').prop('rightBarButtons')
    .find(({ testID }) => testID === 'SubmissionsList.postpolicy')
  expect(button).toBeDefined()

  const settingsButton = tree.find('Screen').prop('rightBarButtons')
    .find(({ testID }) => testID === 'submission-list.settings')
  expect(settingsButton).toBeUndefined()
})

test('should show old settings button if new gradebook not enabled', async () => {
  let navigator = template.navigator({
    show: jest.fn(),
  })

  let tree = shallow(
    <SubmissionList {...props} navigator={navigator} />
  )

  await new Promise(resolve => tree.setState({ flags: [], didFetchFlags: true }, resolve))
  const button = tree.find('Screen').prop('rightBarButtons')
    .find(({ testID }) => testID === 'SubmissionsList.postpolicy')
  expect(button).toBeUndefined()

  const settingsButton = tree.find('Screen').prop('rightBarButtons')
    .find(({ testID }) => testID === 'submission-list.settings')
  expect(settingsButton).toBeDefined()
})

test('should navigate to a submission', () => {
  let submission = props.submissions[1]
  let navigator = template.navigator({
    show: jest.fn(),
  })
  const tree = renderer.create(
    <SubmissionList {...props} navigator={navigator} />
  )
  let instance = tree.getInstance()

  instance.navigateToSubmission(1)(submission.user.id)
  expect(navigator.show).toHaveBeenCalledWith(
    '/courses/12/assignments/32/submissions/2',
    { modal: true, modalPresentationStyle: 'fullscreen' },
    { filter: expect.any(Function), studentIndex: 1, flags: [] }
  )
})

it('renders the row properly', () => {
  let comp = new SubmissionList(props)

  expect(renderer.create(
    comp.renderRow({ item: comp.props.submissions[0], index: 0 })
  ).toJSON()).toMatchSnapshot()
})

it('renders a group row properly', () => {
  let newProps = {
    ...props,
    isGroupGradedAssignment: true,
    submissions: [templates.submission({
      user: templates.user({ id: '1' }),
    })],
    groups: [templates.group({
      members: {
        edges: [{
          member: { user: templates.user({ id: '1' }) },
        }],
      },
    })],
  }
  let comp = new SubmissionList(newProps)

  expect(renderer.create(
    comp.renderRow({ item: comp.props.submissions[0], index: 0 })
  ).toJSON()).toMatchSnapshot()
})

describe('shows message compose with correct data', () => {
  let navigator = template.navigator({
    show: jest.fn(),
  })
  const tree = renderer.create(
    <SubmissionList {...props} navigator={navigator} />
  )
  let instance = tree.getInstance()

  let expectSubjectToBeCorrect = (subject: string) => {
    instance.messageStudentsWho()
    expect(navigator.show).toHaveBeenCalledWith('/conversations/compose', { modal: true }, {
      recipients: instance.props.submissions.map(({ user }) => user),
      subject: subject,
      contextCode: `course_${instance.props.courseID}`,
      contextName: instance.props.courseName,
      canAddRecipients: false,
      onlySendIndividualMessages: true,
    })
  }

  it('handles all submissions', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'all'))
    expectSubjectToBeCorrect('All submissions - Blah')
  })

  it('handles late submissions', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'late'))
    expectSubjectToBeCorrect('Submitted late - Blah')
  })

  it('handles un-submissions', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'not_submitted'))
    expectSubjectToBeCorrect("Haven't submitted yet - Blah")
  })

  it('handles un-gradedness', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'ungraded'))
    expectSubjectToBeCorrect("Haven't been graded - Blah")
  })

  it('handles graded', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'graded'))
    expectSubjectToBeCorrect('Graded - Blah')
  })

  it('handles scored less than', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'lessthan', 50))
    expectSubjectToBeCorrect('Scored less than 50 - Blah')
  })

  it('handles scored more than', () => {
    instance.applyFilter(updateFilterSelection(instance.state.filterOptions, 'morethan', 50))
    expectSubjectToBeCorrect('Scored more than 50 - Blah')
  })
})

describe('graphql props', () => {
  it('returns default props when loading', () => {
    expect(graphqlProps({ data: { loading: true } })).toEqual({
      isGroupGradedAssignment: false,
      pointsPossible: 100,
      pending: true,
      submissions: [],
      anonymous: false,
      muted: false,
      gradingType: 'points',
      sections: [],
    })
  })

  it('works for basic properties', () => {
    let results = templates.submissionListResult()
    expect(graphqlProps({ data: results })).toMatchObject({
      courseName: results.assignment.course.name,
      pointsPossible: results.assignment.pointsPossible,
      submissions: results.assignment.submissions.edges.map(({ submission }) => submission),
      anonymous: results.assignment.anonymousGrading,
      muted: results.assignment.muted,
      assignmentName: results.assignment.name,
      gradingType: results.assignment.gradingType,
      sections: results.assignment.course.sections.edges.map(({ section }) => section),
    })
  })

  it('isGroupGradedAssignment', () => {
    let results = templates.submissionListResult({
      assignment: templates.assignment({
        gradeGroupStudentsIndividually: true,
        groupSet: templates.groupSet(),
        course: templates.course({
          sections: { edges: [] },
          groups: {
            edges: [{
              group: templates.group({
                members: {
                  edges: [{ member: templates.user({ id: '1' }) }],
                },
              }),
            }],
          },
        }),
        submissions: { edges: [] },
        groupedSubmissions: { edges: [{ submission: templates.submission({ user_id: '1' }) }] },
      }),
    })

    expect(graphqlProps({ data: results }).isGroupGradedAssignment).toBeFalsy()

    results.assignment.gradeGroupStudentsIndividually = false
    expect(graphqlProps({ data: results }).isGroupGradedAssignment).toBeTruthy()
    expect(graphqlProps({ data: results }).submissions).toEqual([
      templates.submission({ user_id: '1' }),
    ])

    results.assignment.groupSet = undefined
    expect(graphqlProps({ data: results }).isGroupGradedAssignment).toBeFalsy()
  })
})
