# Style Guide

We will be following the Google [TypeScript style guide](https://google.github.io/styleguide/tsguide.html). Here I have included some of the common requirements. Go to the site to find more information.

## TOC

- [Naming Conventions](#naming-conventions)
  - [Components](#components)
  - [Functions](#functions)
    - [Event Handlers](#event-handlers)
  - [Members](#members)
- [File Stucture](#file-structure)
- [React Notes](#react-notes)

## Naming Conventions

### Components

### Functions

#### Event Handlers

### Members

## File Structure

Files consist of the following, in order:

1. Copyright information, if present
2. JSDoc with @fileoverview, if present
3. Imports, if present
4. The file’s implementation

Exactly one blank line separates each section that is present.

// Libraries

// Components

## React Notes

### Use useEffect Hook sparingly!!

Basically don't use it at all unleass thinsa re being syncronized form an outside source (AKA get requests to server, socket/websocket things, etc)
Don't use it for POST requests, do that in the event handlers that should spawn the requests (Ex onClick).
