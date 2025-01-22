#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project name
PROJECT_NAME="BoxsuApp"
TEMP_PROJECT_NAME="TempBoxsuApp"

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to backup existing files
backup_existing() {
    if [ -d "$1" ]; then
        backup_dir="$1_backup_$(date +%Y%m%d_%H%M%S)"
        log "Creating backup of $1 to $backup_dir"
        mv "$1" "$backup_dir"
        success "Backup created successfully"
    fi
}

# Check and install dependencies
install_dependencies() {
    log "Checking and installing dependencies..."

    # Check for Homebrew
    if ! command_exists brew; then
        warning "Homebrew not found. Installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi

    # Check for Node.js
    if ! command_exists node; then
        warning "Node.js not found. Installing..."
        brew install node
    fi

    # Check for Watchman
    if ! command_exists watchman; then
        warning "Watchman not found. Installing..."
        brew install watchman
    fi

    # Check for CocoaPods
    if ! command_exists pod; then
        warning "CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi

    # Check for Xcode Command Line Tools
    if ! xcode-select -p &>/dev/null; then
        warning "Xcode Command Line Tools not found. Installing..."
        xcode-select --install
        # Wait for installation to complete
        while ! xcode-select -p &>/dev/null; do
            sleep 1
        done
    fi

    success "All dependencies installed successfully"
}

# Function to fix iOS setup
fix_ios_setup() {
    log "Fixing iOS setup..."

    # Backup existing iOS directory if it exists
    backup_existing "ios"

    # Create temporary project to get fresh iOS files
    log "Creating temporary React Native project..."
    npx react-native@latest init $TEMP_PROJECT_NAME --verbose
    
    if [ -d "$TEMP_PROJECT_NAME/ios" ]; then
        log "Copying iOS directory from temporary project..."
        cp -R "$TEMP_PROJECT_NAME/ios" .
        success "iOS directory copied successfully"
        
        # Clean up temporary project
        rm -rf $TEMP_PROJECT_NAME
        
        # Run pod install
        cd ios
        log "Installing CocoaPods dependencies..."
        pod install --repo-update
        cd ..
    else
        error "Failed to create temporary project"
        exit 1
    fi
}

# Function to fix project structure
fix_project_structure() {
    log "Fixing project structure..."

    # Create necessary directories
    directories=(
        "src"
        "src/components"
        "src/screens"
        "src/navigation"
        "src/assets"
        "src/services"
        "src/config"
        "src/hooks"
        "src/contexts"
        "__tests__"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            success "Created directory: $dir"
        fi
    done

    # Check and fix essential files
    if [ ! -f "babel.config.js" ]; then
        echo "module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};" > babel.config.js
        success "Created babel.config.js"
    fi

    if [ ! -f "metro.config.js" ]; then
        echo "const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);" > metro.config.js
        success "Created metro.config.js"
    fi
}

# Function to fix dependencies
fix_dependencies() {
    log "Fixing dependencies..."

    # Install required dependencies
    npm install --save @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context

    # Fix vulnerabilities
    npm audit fix

    # Clean npm cache
    npm cache clean --force

    success "Dependencies fixed successfully"
}

# Function to clean and rebuild
clean_and_rebuild() {
    log "Cleaning and rebuilding project..."

    # Clean watchman watches
    watchman watch-del-all

    # Clean React Native cache
    rm -rf $TMPDIR/react-*
    rm -rf $TMPDIR/metro-*
    rm -rf $TMPDIR/haste-*

    # Clean iOS build
    if [ -d "ios" ]; then
        cd ios
        rm -rf build
        rm -rf Pods
        pod install
        cd ..
    fi

    success "Clean and rebuild completed"
}

# Main execution
main() {
    log "Starting project fix script..."

    # Check if we're in the project directory
    if [ ! -f "package.json" ]; then
        error "Not in a React Native project directory (package.json not found)"
        exit 1
    fi

    # Run all fix functions
    install_dependencies
    fix_ios_setup
    fix_project_structure
    fix_dependencies
    clean_and_rebuild

    # Final check
    if [ -d "ios" ] && [ -d "node_modules" ]; then
        success "Project setup completed successfully!"
        echo -e "\n${GREEN}Next steps:${NC}"
        echo "1. Run 'npx react-native start' to start Metro"
        echo "2. In a new terminal, run 'npx react-native run-ios'"
        echo "3. Check for any errors in the Metro bundler"
    else
        error "Some steps failed. Please check the logs above."
    fi
}

# Run the script
main 2>&1 | tee setup_log_$(date +%Y%m%d_%H%M%S).log
