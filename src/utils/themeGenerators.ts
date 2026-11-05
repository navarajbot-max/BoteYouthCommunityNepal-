/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildBloggerWorkingXml } from './bloggerWorkingXmlTemplate';

export interface BloggerCustomLeader {
  id?: string;
  name: string;
  nepaliName: string;
  role: string;
  term: string;
  bio: string;
  photoUrl: string;
  colorRibbon?: string;
  phone?: string;
  ward?: string;
}

export interface BloggerThemeCustomization {
  siteName?: string;
  tagline?: string;
  location?: string;
  contactPhone?: string;
  contactEmail?: string;
  primaryColor?: string; // e.g. #DC143C (Nepali Red)
  secondaryColor?: string; // e.g. #003893 (Nepali Blue)
  logoUrl?: string;
  bentoConfig?: {
    pillText?: string;
    title?: string;
    subtitle?: string;
    heritageTag?: string;
    heritageTitle?: string;
    heritageDesc?: string;
    traditionsBadge?: string;
    traditionsTitle?: string;
    traditionsDesc?: string;
    dialectBadge?: string;
    dialectTitle?: string;
    dialectDesc?: string;
  };
  pillarsConfig?: {
    tag?: string;
    title?: string;
    desc?: string;
    p1Title?: string;
    p1Desc?: string;
    p2Title?: string;
    p2Desc?: string;
    p3Title?: string;
    p3Desc?: string;
    p4Title?: string;
    p4Desc?: string;
  };
  leaders?: BloggerCustomLeader[];
}

export function generateBloggerXmlTheme(options: BloggerThemeCustomization): string {
  return buildBloggerWorkingXml(options);
}

export function generateWordPressThemeZip(options: {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}): { [filename: string]: string } {
  const { siteName, primaryColor, secondaryColor, logoUrl } = options;
  const safeLogoUrl = logoUrl && logoUrl.trim() ? logoUrl.trim() : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=120&auto=format&fit=crop&q=80';

  return {
    'style.css': `/*
Theme Name: ${siteName} WordPress Theme
Theme URI: https://boteyouthcommunity.org.np
Author: Bote Youth Community Nepal
Description: Official WordPress Theme for Bote Youth Community Nepal with authentic Nepali Flag colors (Red, White, Blue).
Version: 2.5.0
Text Domain: bote-youth-nepal
*/

:root {
  --nepal-red: ${primaryColor};
  --nepal-blue: ${secondaryColor};
  --nepal-white: #ffffff;
  --nepal-gold: #f59e0b;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f8fafc;
  color: #0f172a;
}
`,
    'index.php': `<?php
get_header(); ?>

<div class="site-hero" style="background:linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);color:#fff;padding:60px 20px;text-align:center;">
  <div style="max-width:900px;margin:0 auto;">
    <h1 style="font-size:36px;font-weight:900;margin-bottom:12px;"><?php bloginfo('name'); ?></h1>
    <p style="font-size:17px;opacity:0.95;"><?php bloginfo('description'); ?></p>
  </div>
</div>

<div class="site-main-content" style="max-width:1200px;margin:40px auto;padding:0 20px;display:grid;grid-template-columns:2.5fr 1fr;gap:40px;">
  <main>
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <article style="background:#fff;padding:24px;border-radius:12px;margin-bottom:24px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <h2 style="margin-top:0;"><a style="color:${primaryColor};text-decoration:none;" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <div style="font-size:12px;color:#64748b;margin-bottom:12px;"><?php the_time('F j, Y'); ?> by <?php the_author(); ?></div>
        <div><?php the_excerpt(); ?></div>
      </article>
    <?php endwhile; endif; ?>
  </main>
  <aside>
    <?php get_sidebar(); ?>
  </aside>
</div>

<?php get_footer(); ?>
`,
    'header.php': `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div style="background:${secondaryColor};color:#fff;padding:6px 20px;font-size:12px;display:flex;justify-content:space-between;">
  <span>🇳🇵 Official Portal of Bote Youth Community Nepal</span>
  <span>Hotline: +977-9806389212</span>
</div>
<header style="background:#fff;border-bottom:3px solid ${primaryColor};padding:14px 20px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
  <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
    <a href="<?php echo esc_url(home_url('/')); ?>" style="display:flex;align-items:center;gap:12px;text-decoration:none;">
      <img src="${safeLogoUrl}" alt="Logo" style="width:48px;height:48px;border-radius:50%;border:2px solid ${primaryColor};" />
      <div>
        <strong style="font-size:18px;color:${primaryColor};display:block;"><?php bloginfo('name'); ?></strong>
        <span style="font-size:11px;color:${secondaryColor};text-transform:uppercase;">Culture &amp; Youth Leadership</span>
      </div>
    </a>
    <nav>
      <?php wp_nav_menu(array('theme_location' => 'primary', 'menu_class' => 'nav-menu')); ?>
    </nav>
  </div>
</header>
`,
    'footer.php': `<footer style="background:#0b1329;color:#cbd5e1;padding:40px 20px 20px;border-top:4px solid ${primaryColor};">
  <div style="max-width:1200px;margin:0 auto;text-align:center;">
    <p style="font-size:14px;margin-bottom:8px;">&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All Rights Reserved.</p>
    <p style="font-size:12px;color:#94a3b8;">Preserving Bote Language, History, Traditional Dress &amp; Empowering Sarlahi Youth.</p>
  </div>
  <?php wp_footer(); ?>
</footer>
</body>
</html>
`,
    'functions.php': `<?php
function bycn_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  register_nav_menus(array(
    'primary' => __('Primary Menu', 'bote-youth-nepal'),
  ));
}
add_action('after_setup_theme', 'bycn_setup');
`
  };
}
