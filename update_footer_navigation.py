#!/usr/bin/env python3
"""
Update footer navigation across all HTML pages to add Maps link.
This script finds the "Entreprise" footer navigation section and adds a link to maps.html.
"""

import re
import os
from pathlib import Path

def update_footer_nav(file_path):
    """
    Update the footer navigation in a single HTML file to add Maps link.

    Args:
        file_path: Path to the HTML file to update

    Returns:
        Tuple of (success: bool, message: str)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file has already been updated
        if 'href="maps.html"' in content or "href='maps.html'" in content:
            return True, f"Already has Maps link"

        # Pattern to find the Entreprise footer nav section
        # We're looking for the nav with "Entreprise" label followed by links
        pattern = r'(<nav class="footer-nav-col" aria-label="Entreprise">.*?<li><a href="actualites\.html"[^>]*>.*?Médias.*?</a></li>)'

        # The replacement: add Maps link after Médias/Media
        replacement = r'\1\n          <li><a href="maps.html" data-i18n data-en="Operations Map">Carte des Opérations</a></li>'

        updated_content = re.sub(
            pattern,
            replacement,
            content,
            flags=re.DOTALL | re.IGNORECASE,
            count=1
        )

        # Check if replacement was made
        if updated_content == content:
            return False, f"Could not find footer pattern in {file_path}"

        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        return True, f"Successfully updated"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Main function to update all HTML files."""
    site_dir = Path(__file__).parent

    # Find all HTML files in the root directory (not subdirectories)
    html_files = sorted(site_dir.glob('*.html'))

    # Skip certain files that don't need updating
    skip_files = {'maps.html', '404.html', '500.html', 'offline.html'}

    print("=" * 70)
    print("EnerTchad Groupe — Footer Navigation Update Script")
    print("=" * 70)
    print(f"\nSearching for HTML files in: {site_dir}\n")

    files_to_update = [f for f in html_files if f.name not in skip_files]

    if not files_to_update:
        print("No HTML files found to update.")
        return

    print(f"Found {len(files_to_update)} HTML files to update:\n")

    success_count = 0
    fail_count = 0

    for html_file in files_to_update:
        success, message = update_footer_nav(html_file)
        status = "✓ OK" if success else "✗ FAIL"
        print(f"  {status}  {html_file.name:<35} — {message}")

        if success:
            success_count += 1
        else:
            fail_count += 1

    print("\n" + "=" * 70)
    print(f"Results: {success_count} updated, {fail_count} failed")
    print("=" * 70)

    if fail_count > 0:
        print("\nNote: Some files may need manual updating.")
        print("The pattern looks for:")
        print('  <nav class="footer-nav-col" aria-label="Entreprise">')
        print('    ...')
        print('    <li><a href="actualites.html"...>Médias</a></li>')
    else:
        print("\nAll files updated successfully!")
        print("Maps link added to footer 'Entreprise' section.")

if __name__ == '__main__':
    main()
