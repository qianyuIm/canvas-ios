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

#import <UIKit/UIKit.h>

@class CBIColorfulViewModel;
@interface CBIColorfulCell : UITableViewCell
@property (nonatomic) CBIColorfulViewModel *viewModel;
@property (nonatomic, getter=isIconRound) BOOL roundIcon;

@property IBOutlet UIImageView *customIcon;
@property IBOutlet UILabel *customTitleLabel;
@property IBOutlet UILabel *customDetailLabel;

// called on tap and to reflect selection override as needed
// to reflect highlighted/selected state
- (void)updateHighlight;

@property (nonatomic) UIView *highlightedAccessoryView;
@property (nonatomic) UIView *nonHighlightedAccessoryView;

@end
