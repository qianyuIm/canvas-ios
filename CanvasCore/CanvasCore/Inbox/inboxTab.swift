//
//  inboxTab.swift
//  CanvasCore
//
//  Created by Derrick Hathaway on 10/3/17.
//  Copyright © 2017 Instructure, Inc. All rights reserved.
//

import UIKit
import ReactiveSwift
import ReactiveCocoa

public func inboxTab() -> UIViewController {
    let inboxVC = HelmViewController(moduleName: "/conversations", props: [:])
    let inboxNav = HelmNavigationController(rootViewController: inboxVC)
    
    let inboxSplit = HelmSplitViewController()
    
    let empty = HelmNavigationController()
    empty.navigationBar.barTintColor = Brand.current.navBgColor
    empty.navigationBar.tintColor = Brand.current.navButtonColor
    empty.navigationBar.isTranslucent = false
    
    inboxSplit.viewControllers = [inboxNav, empty]
    let icon = UIImage.icon(.email)
    inboxSplit.tabBarItem = UITabBarItem(title: NSLocalizedString("Inbox", tableName: nil, bundle: .core, value: "Inbox", comment: "Inbox tab title"), image: icon, selectedImage: nil)
    inboxSplit.tabBarItem.accessibilityIdentifier = "tab-bar.inbox-btn"
    inboxSplit.extendedLayoutIncludesOpaqueBars = true
    
    inboxSplit.tabBarItem.reactive.badgeValue
        <~ TabBarBadgeCounts.unreadMessageCount
            .map { count in count > 0 ? "\(count)" : nil }
    
    return inboxSplit
}
