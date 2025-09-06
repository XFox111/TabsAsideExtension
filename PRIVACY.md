# Tabs aside extension Privacy policy
1. Developers of the extension don't affiliate with Google LLC, Mozilla Foundation or Microsoft Corporation in any way.
2. This extension stores user data only related to its core functionality. This includes:
   - User settings
   - User saved collections of tabs
   - Thumbnails of saved tabs
3. This extension uses Google Analytics to collect usage statistics and improve the extension.
4. This extension uses analytics to collect following data:
   - Random UUID to distinguish unique users
   - Browser name and version
   - Operating system name and version
   - System architecture
   - Screen resolution
   - Extension language
   - User settings
   - Number of saved collections
   - Events, related to user's actions:
      - `bmc_clicked` (when "Buy me a Coffee" button is clicked)
      - `collection_list` (when extension's options page is opened)
      - `cta_dismissed` (when "Like this extension?" prompt is closed)
      - `extension_installed` (when extension is installed or updated)
      - `feedback_clicked` (when "Leave feedback" button is clicked)
      - `item_created` (when new collection or group is created using dialog window)
      - `item_edited` (when collection or group is edited)
      - `options_page` (when extension's options page is opened)
      - `page_view` (when extension's page is opened)
      - `save` (when "Save all tabs" or "Save selected tabs" buttons are clicked)
      - `set_aside` (when "Set all tabs aside" or "Set selected tabs aside" buttons are clicked)
      - `used_drag_and_drop` (when items inside collection list were reordered)
      - `visit_blog_button_click` (when "Read dev blog" button is clicked)
      - `bookmarks_saved` (when "Export to bookmarks" option is clicked)
   - Events, related to extension errors:
      - `background_error` (when error inside background service has occured)
      - `cloud_get_error` (when failed to retrieve collections from the cloud storage)
      - `conflict_resolve_with_cloud_error` (when failed to retrieve collections from the cloud storage during storage conflict resolution)
      - `cloud_save_error` (when failed to save collections to the cloud storage)
      - `messaging_error` (when failed to send a message to extenion's background service)
      - `notification_error` (when failed to display a toast notification)
4. Following events, beside their name, include additional information, such as:
   - `item_created` and `item_edited`:
      - Type of the affected item (`collection` or `group`)
   - `extension_installed`:
      - Reason for update (`install`, `update`, or `browser_update`)
      - Previously installed extension's version, if applicable
   - `page_view`:
      - Type of the page (`options_page` or `collection_list`)
   - All extension's error events:
      - Error name
      - Error message
      - Error call stack
4. This extension does not collect or use any personally identifiable information (PII) or sensitive data for purposes other than its core functionality.
5. This extension uses cloud storage built into your browser to store its data.
6. Refer to your browser's developer regarding the privacy policy of the cloud storage used by your browser.
