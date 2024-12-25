# dynamech


    /** Assertion 
         * Есть два разных подхода: 
         * 1) создавать методы для Assertion в POM и инкапсулировать детали проверки,
         * детали верстки
         * 2) проводить Assertion прямо в тесте без всяких оберток
         * **/
        await workspacePage.isContainWorkspace(newWorkspaceName)
        // await expect(this.workspaceList).toContainText(checkedWorkspace);