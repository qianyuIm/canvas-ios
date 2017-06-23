// @flow

import { mapStateToProps } from '../map-state-to-props'
import type { SubmissionDataProps } from '../submission-prop-types'
import shuffle from 'knuth-shuffle-seeded'

jest.mock('knuth-shuffle-seeded', () => jest.fn())

let t = {
  ...require('../../../../api/canvas-api/__templates__/assignments'),
  ...require('../../../../api/canvas-api/__templates__/submissions'),
  ...require('../../../../api/canvas-api/__templates__/enrollments'),
  ...require('../../../../api/canvas-api/__templates__/users'),
  ...require('../../../../api/canvas-api/__templates__/assignments'),
  ...require('../../../../redux/__templates__/app-state'),
  ...require('../__templates__/submission-props'),
}

export const submissionProps: Array<SubmissionDataProps> = [
  t.submissionProps({
    name: 'S1',
    status: 'none',
    grade: 'not_submitted',
    userID: '1',
  }),
  t.submissionProps({
    name: 'S2',
    status: 'none',
    grade: 'excused',
    userID: '2',
  }),
  t.submissionProps({
    name: 'S3',
    status: 'late',
    grade: 'ungraded',
    userID: '3',
  }),
  t.submissionProps({
    name: 'S4',
    status: 'submitted',
    grade: 'A-',
    userID: '4',
  }),
]

function createHappyPathTestState () {
  const enrollments: EnrollmentsState = {
    '0': t.enrollment({ id: '0', user_id: '0', type: 'TeacherEnrollment' }),
    '1': t.enrollment({ id: '1', user_id: '1', user: t.user({ id: '1', name: 'S1', sortable_name: 'S1' }) }),
    '2': t.enrollment({ id: '2', user_id: '2', user: t.user({ id: '2', name: 'S2', sortable_name: 'S2' }) }),
    '3': t.enrollment({ id: '3', user_id: '3', user: t.user({ id: '3', name: 'S3', sortable_name: 'S3' }) }),
    '4': t.enrollment({ id: '4', user_id: '4', user: t.user({ id: '4', name: 'S4', sortable_name: 'S4' }) }),
    // user in two sections or as a TA & Student
    '5': t.enrollment({ id: '5', user_id: '4', user: t.user({ id: '4', name: 'S4', sortable_name: 'S5' }) }),
  }

  const submissions: SubmissionsState = {
    // S1 has not submitted
    '20': {
      submission: t.submissionHistory([{
        id: '20',
        user_id: '2',
        grade: undefined,
        submitted_at: undefined,
        workflow_state: 'unsubmitted',
        excused: true,
        late: true,
      }]),
      pending: 0,
      error: null,
      selectedIndex: null,
      selectedAttachmentIndex: null,
      rubricGradePending: false,
    },
    '30': {
      submission: t.submissionHistory([{
        id: '30',
        user_id: '3',
        grade: undefined,
        submitted_at: '2017-04-05T15:12:45Z',
        workflow_state: 'submitted',
        excused: false,
        late: true,
      }]),
      pending: 0,
      error: null,
      selectedIndex: null,
      selectedAttachmentIndex: null,
      rubricGradePending: false,
    },
    '40': {
      submission: t.submissionHistory([{
        id: '40',
        user_id: '4',
        grade: 'A-',
        submitted_at: '2017-04-05T15:12:45Z',
        workflow_state: 'submitted',
        excused: false,
        late: false,
      }]),
      pending: 0,
      error: null,
      selectedIndex: null,
      selectedAttachmentIndex: null,
      rubricGradePending: false,
    },
  }

  const enrRefs = { pending: 0,
    refs: ['0', '1', '2', '3', '4'],
  }

  const courses = {
    '100': { enrollments: enrRefs, color: '#000', course: { name: 'fancy name' } },
  }

  const subRefs = { pending: 0, refs: ['20', '30', '40'] }
  const assignments = {
    '1000': {
      submissions: subRefs,
      data: t.assignment({
        points_possible: 5,
        muted: true,
        name: "Trump's Tweets",
      }),
      anonymousGradingOn: false,
    },
  }

  return t.appState({
    entities: {
      enrollments,
      submissions,
      courses,
      assignments,
    },
  })
}

beforeEach(() => jest.resetAllMocks())

test('submissions', () => {
  let state = createHappyPathTestState()
  expect(mapStateToProps(state, { courseID: '100', assignmentID: '1000' })).toMatchObject({
    courseColor: '#000',
    courseName: 'fancy name',
    pending: false,
    submissions: submissionProps,
    pointsPossible: 5,
    anonymous: false,
    muted: true,
  })
})

test('submissions with missing data', () => {
  const state = t.appState({
    entities: {
      enrollments: {},
      submissions: {},
      courses: {},
      assignments: {},
    },
  })

  expect(mapStateToProps(state, { courseID: '100', assignmentID: '1000' })).toMatchObject({
    courseColor: '#FFFFFF',
    courseName: '',
    pending: true,
  })
})

test('anonymous grading shuffles the data', () => {
  let state = createHappyPathTestState()
  state.entities.assignments['1000'].anonymousGradingOn = true

  mapStateToProps(state, { courseID: '100', assignmentID: '1000' })
  expect(shuffle).toHaveBeenCalled()
})
