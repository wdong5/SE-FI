SE-FI: Surrogate Error Fault Injector
====

**NOTE: We're in the process of updating SE-FI to use the latest LLVM version, and also support Machine Learning (ML) operations.

SE-FI is an LLVM based fault injection tool, that injects faults into the LLVM IR of the application source code.  The faults can be injected into specific program points, and the effect can be easily tracked back to the source code.  SE-FI is typically used to map fault characteristics back to source code, and hence understand source level or program characteristics for various kinds of fault outcomes to simulate the error characteristics of ML surrogates.   

Please join the following Groups for asking questions about SE-FI that are not answered in the documentation: dwq.hnu@gmail.com

Auto-Installer
--------------
This is the recommended method for building the SE-FI. If you wish to build the SE-FI via the auto-installer, you *do not need* to clone the SE-FI git repository. Simply download the installer script by itself, and it will fetch the latest version of the git repository for you. The SE-FI auto-installer takes the form of a single python script (installer/installLLFI.py). To run the script, simply copy it into the directory where you would like to build the SE-FI and, from the command line, run `python3 InstallLLFI.py`.
  
Dependencies:
  1. 64 Bit Machine
  2. 64 Bit Linux or OS X
  3. Cmake (mininum v2.8)
  4. Python 3 and above
  5. tcsh (for GUI)
  6. GraphViz package (for visualizing error propagation)
  7. Internet Connection

GUI Dependencies:
  1. JDK7/JDK8 with JavaFX
  2. tcsh shell

Usage:
run "python3 InstallLLFI.py -h" to see all running options/guidelines
  1. Copy the InstallLLFI.py script to where you want to build the LLFI
  2. Make sure you are _not_ logged in as root
  2. Run "python3 InstallLLFI.py"
  3. Wait for compilation to finish
  4. Run the GUI by executing "./llfi-gui" under the bin/ folder

About tcsh:

The SE-FI-GUI uses tcsh to read environment variables describing the location of the SE-FI build. The installer will automatically add those environment variables to your ~/.tcshrc file. You do not need to actively use tcsh as your primary shell, simply having it installed is enough.

Manual Install
---------------
This method is also available, and may be more suitable if you want more control over the location of the LLVM build that the SE-FI requires (ie, you already have LLVM built and wish to use that build).

Dependencies:
  
  1. 64 Machine with 64 bit Linux or OS X
  2. CMake (minimum v2.8)
  3. Python 3 and above
  4. Python YAML library (PyYAML)
  5. Clang v3.4
  6. LLVM v3.4, built with CMake
    * Build llvm-3.4 **WITH CMAKE** using flag `-DLLVM_REQUIRES_RTTI=1`. [Instructions](http://llvm.org/docs/CMake.html)
    * Remember to run `make` in the llvm build directory after running `cmake`.
  9. GraphViz package (for visualizing error propagation)

GUI Dependencies:
  1. JDK7/JDK8 with JavaFX
  2. tcsh shell

Building:
  
  Run `./setup --help` for build instructions.
```
  $ ./setup --help

  Usage: setup OPTIONS
  List of options:
  -LLVM_DST_ROOT <LLVM CMake build root dir>:
      Make sure you build LLVM with CMake and pass build root directory here
  -LLVM_SRC_ROOT <LLVM source root dir>
  -LLFI_BUILD_ROOT <path where you want to build LLFI>
  -LLVM_GXX_BIN_DIR <llvm-gcc/g++'s parent dir> (optional):
      You don't need to set it if it is in system path
  -JAVA_HOME_DIR <java home directory for oracle jdk 7 or higher> (optional):
    You don't need to set it if your default jdk is oracle jdk 7 or higher and in system path


  --help(-h): show help information
  --no_gui: Add this option if you do not want GUI.
  --runTests: Add this option if you want to run all regression tests after building LLFI.
```

  Here is a sample build command if `clang` and `javac` are already in $PATH:
```
  ./setup -LLFI_BUILD_ROOT $BUILD/LLFI -LLVM_SRC_ROOT $SRC/llvm-3.4 -LLVM_DST_ROOT $BUILD/llvm-3.4
```

Build without GUI:
To build SE-FI without GUI, just add option: `--no_gui` in the command line for setup, for example:
```
./setup -LLFI_BUILD_ROOT $BUILD/LLFI -LLVM_SRC_ROOT $SRC/llvm-3.4 -LLVM_DST_ROOT $BUILD/llvm-3.4 --no_gui
```

Running tests:
Running all regression tests after installation is highly recommended. Note that you may encounter some error messages during the fault injection stage. This is normal. Once all tests have completed and they all passed, LLFI is correctly installed.


Running
-------
You can use test programs in the directory `sample_programs/` or `test_suite/PROGRAMS/` to test SE-FI. Programs in the `sample_programs` directory already contains a valid `input.yaml` file.
####Command line
Example program: `factorial`
  1. Copy the `sample_programs/factorial/` directory to your project directory. 
  2. Change to your `factorial` directory Build a single IR file with the SE-FI tool `GenerateMakefile`
      ```
      <LLFI_BUILD_ROOT>/tools/GenerateMakefile --readable --all -o factorial.ll
      ```
     Alternatively, you can build your own IR file with `clang`.
  3. Instrument factorial with calls to SE-FI libraries and create executables under *llfi* directory
      ```
      <LLFI_BUILD_ROOT>/bin/instrument --readable factorial.ll
      ```
  4. Run factorial executable with profiling functions instrumented
      ```
      <LLFI_BUILD_ROOT>/bin/profile ./llfi/factorial-profiling.exe 6
      ```
     In file *llfi/baseline/golden_std_output*, you should be able to see 720
  5. Run `factorial` executable with fault injection functions instrumented
      ```
      <LLFI_BUILD_ROOT>/bin/injectfault ./llfi/factorial-faultinjection.exe 6
      ```
      
Basic Usage
-------
There are some important commands to use LLFI, and we use `sum` as example. And these commands must be executed with input.yaml under the same path.
1. Complie the program
```clang -emit-llvm -S *.c ```
2. Instrumenting code in the program IR.
```instrument --readable sum.ll ```
3. Run the fault-free IR
```profile ./llfi/sum-profiling.exe 10```
4. Inject fault to the IR
```injectfault ./llfi/sum-faultinjection.exe 10```
5. Analyze the result
```python measure.py```



####GUI
If you have used `./setup` to install SE-FI, you need to set new environment variables for tcsh shell before running the GUI for the first time. Open `~/.tcshrc` using your favourite text editor and add `setenv llfibuild <LLFI_BUILD_ROOT>/` and `setenv zgrviewer <LLFI_BUILD_ROOT>/tools/zgrviewer/` to it. [OPTIONAL] Create an environment variable "COMPARE" with the path of the SDC check script.

Execute `<LLFI_BUILD_ROOT>/bin/llfi-gui` to start the **GUI**. The outputs will be saved in the directory where you have executed the command.

####Web GUI Development Environment Setup
Dependencies:
Nodejs
webpack   

Steps to set up the development environment:   
1: Download this project from Git   
2: Download NodeJs   
3: Install libraries: Go to the web-app directory and run "npm install"   
4: Install Webpack: In the same directory as step 3, run "sudo npm install -g webpack"   
5: Configurate the LLFI root path for the server:   
The default bevaiour of the program use environment variable $llfibuild as the path of the llfi build directory  
You can set the environment variable llfibuild in your system to point it to the SE-FI build directory in your local machine.   

Start the server:   
Go to the /web-app/server folder and run "node server.js"  

Start the front-end dev tool:   
Go to the web-app directory and run "webpack" or "webpack -w"   

Results
-------
After fault injection, output from SE-FI and the tested application can be found
in the *llfi* directory.

|     Directory         |                 Contents                       |
| ----------------------| ---------------------------------------------- |
| *std_output*          | Piped STDOUT from the tested application       |
| *llfi_stat_output*    | Fault injection statistics                     |
| *error_output*        | Failure reports (program crashes, hangs, etc.) |
| *trace_report_output* | Faults propogation report files and graph      |

