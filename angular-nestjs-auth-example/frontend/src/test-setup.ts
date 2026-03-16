import 'zone.js';
import 'zone.js/testing';
import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { vi } from 'vitest';

vi.mock('@beefree.io/angular-email-builder', async () => {
	const { Component, Injectable } = await import('@angular/core');

	@Component({
		selector: 'lib-beefree-builder',
		standalone: true,
		template: '',
	})
	class MockBeefreeBuilder {}

	@Injectable()
	class MockBeefreeService {
		load = vi.fn();
	}

	return {
		BeefreeBuilder: MockBeefreeBuilder,
		BeefreeService: MockBeefreeService,
	};
});

getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);
