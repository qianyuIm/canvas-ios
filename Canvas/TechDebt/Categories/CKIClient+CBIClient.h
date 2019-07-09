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

#import <CanvasKit/CanvasKit.h>
@import CanvasCore;



@interface CKIClient (CBIClient)

/**
* Creates a copy of the client that can be used for fetching images.
*/
- (nonnull CKIClient *)imageClient;

@property (nonatomic, readonly, nonnull) Session *authSession;

@end

extern NSString * _Nonnull const CBICourseColorUpdatedNotification;
extern NSString * _Nonnull const CBICourseColorUpdatedCourseIDKey;
extern NSString * _Nonnull const CBICourseColorUpdatedValue;
