/** Required shield definitions derived from ZMK nice_view, MIT license. */
export const customShieldFiles: Record<string, string> = {
  "zephyr/module.yml": `name: zmk-display-studio-artwork
build:
  settings:
    board_root: .
`,
  "boards/shields/nice_view_custom/Kconfig.shield": `# SPDX-License-Identifier: MIT
config SHIELD_NICE_VIEW_CUSTOM
    def_bool $(shields_list_contains,nice_view_custom)
`,
  "boards/shields/nice_view_custom/Kconfig.defconfig": `# Copyright (c) 2023 The ZMK Contributors
# SPDX-License-Identifier: MIT
if SHIELD_NICE_VIEW_CUSTOM

config LS0XX_VCOM_THREAD_PRIO
    default 11
config LV_Z_VDB_SIZE
    default 100
config LV_DPI_DEF
    default 161
config LV_Z_BITS_PER_PIXEL
    default 1
choice LV_COLOR_DEPTH
    default LV_COLOR_DEPTH_1
endchoice
choice ZMK_DISPLAY_WORK_QUEUE
    default ZMK_DISPLAY_WORK_QUEUE_DEDICATED
endchoice
choice ZMK_DISPLAY_STATUS_SCREEN
    default ZMK_DISPLAY_STATUS_SCREEN_CUSTOM
endchoice
config LV_Z_MEM_POOL_SIZE
    default 8192 if ZMK_DISPLAY_STATUS_SCREEN_CUSTOM
    default 5120 if ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN
config ZMK_DISPLAY_STATUS_SCREEN_CUSTOM
    imply NICE_VIEW_WIDGET_STATUS
config NICE_VIEW_WIDGET_STATUS
    bool "Custom nice!view status widget"
    select LV_FONT_MONTSERRAT_16
    select LV_USE_IMAGE
    select LV_USE_CANVAS
config NICE_VIEW_WIDGET_INVERTED
    bool "Invert custom status widget colors"

if !ZMK_SPLIT || ZMK_SPLIT_ROLE_CENTRAL
config NICE_VIEW_WIDGET_STATUS
    select LV_FONT_MONTSERRAT_18
    select LV_FONT_MONTSERRAT_14
    select LV_FONT_UNSCII_8
    select ZMK_WPM
endif

config ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN
    select LV_FONT_MONTSERRAT_26
endif
`,
  "boards/shields/nice_view_custom/nice_view_custom.conf": `CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=n
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_STACK_SIZE=4096
`,
  "boards/shields/nice_view_custom/nice_view_custom.overlay": `/* Copyright (c) 2022 The ZMK Contributors
 * SPDX-License-Identifier: MIT */
&nice_view_spi {
    status = "okay";
    nice_view: ls0xx@0 {
        compatible = "sharp,ls0xx";
        spi-max-frequency = <1000000>;
        reg = <0>;
        width = <160>;
        height = <68>;
        serial-vcom-inversion;
        serial-vcom-interval = <33>;
    };
};
/ {
    chosen { zephyr,display = &nice_view; };
};
`,
  "boards/shields/nice_view_custom/CMakeLists.txt": `# Reuse upstream support sources instead of duplicating the stock widgets.
if(CONFIG_SHIELD_NICE_VIEW)
  message(FATAL_ERROR "Select nice_view_custom instead of nice_view, not both.")
endif()
set(NICE_VIEW_UPSTREAM "\${CMAKE_SOURCE_DIR}/boards/shields/nice_view")
if(NOT EXISTS "\${NICE_VIEW_UPSTREAM}/widgets/util.c")
  message(FATAL_ERROR "Expected the ZMK nice_view sources; see the generated README.")
endif()
if(CONFIG_ZMK_DISPLAY AND CONFIG_NICE_VIEW_WIDGET_STATUS)
  zephyr_library_include_directories("\${CMAKE_SOURCE_DIR}/include" "\${NICE_VIEW_UPSTREAM}/widgets")
  zephyr_library_sources(custom-status-screen.c)
  zephyr_library_sources("\${NICE_VIEW_UPSTREAM}/widgets/bolt.c" "\${NICE_VIEW_UPSTREAM}/widgets/util.c")
  if(NOT CONFIG_ZMK_SPLIT OR CONFIG_ZMK_SPLIT_ROLE_CENTRAL)
    zephyr_library_sources("\${NICE_VIEW_UPSTREAM}/widgets/status.c")
  else()
    zephyr_library_sources(widgets/art.c widgets/peripheral_status.c)
  endif()
endif()
`,
  "boards/shields/nice_view_custom/custom-status-screen.c": `/* Copyright (c) 2023 The ZMK Contributors
 * SPDX-License-Identifier: MIT */
#include <zephyr/kernel.h>
#if !IS_ENABLED(CONFIG_ZMK_SPLIT) || IS_ENABLED(CONFIG_ZMK_SPLIT_ROLE_CENTRAL)
#include "status.h"
#else
#include "peripheral_status.h"
#endif

static struct zmk_widget_status status_widget;
lv_obj_t *zmk_display_status_screen(void) {
    lv_obj_t *screen = lv_obj_create(NULL);
    zmk_widget_status_init(&status_widget, screen);
    lv_obj_align(zmk_widget_status_obj(&status_widget), LV_ALIGN_TOP_LEFT, 0, 0);
    return screen;
}
`,
};
